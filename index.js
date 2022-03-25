import Parser from "rss-parser";
import express from 'express';
import RSS from "rss";
import moment from "moment";
import cheerio from 'cheerio';
const app = express()
import request from 'request-promise';

const port = 3000

const rss_list = {
    bbc_ru: { url: 'http://feeds.bbci.co.uk/russian/rss.xml', selector: "main > div p" },
    bbc: { url: 'http://feeds.bbci.co.uk/news/world-60525350/rss.xml', selector: "main > div p" },
    ap: { url: 'https://www.pipes.digital/feed/1NjYgr9z', selector: ".Article > p"},
    reuters: { url: 'https://www.pipes.digital/feed/1NklLJOR', selector: ".article-body__content__3VtU3 > p"}
}

const cache = { }

app.use(express.static('dist'))

app.get('/rss_feed', async (req, res) => {
    try {
        // Get the original feed
        let originalFeed;
        let source = req.query.source || 'ap';

        try {
            originalFeed = await new Parser({
                customFields: {
                    feed: ["image", "managingEditor", "copyright", "language"]
                }
            }).parseURL(rss_list[source].url);
        } catch (err) {
            return res.status(400).send('Error: Cannot parse feed.');
        }

        // Create the new feed from the original one
        let newFeed;

        // Return cached element if available
        if(cache[rss_list[source].url]
            && cache[rss_list[source].url].expires
            && cache[rss_list[source].url].data
            && cache[rss_list[source].url].expires.isAfter(moment())) {
            newFeed = cache[rss_list[source].url].data;
            console.log(`Positive hit on cache, serving old data for ${source}...`)
        } else {
            newFeed = new RSS(transformFeed(originalFeed))

            // Transform and add all items to the feed
            const transformedItems = await transformItems(originalFeed.items, rss_list[source].selector);
            transformedItems.forEach((item) => {
                newFeed.item(item);
            })

            // Cache result
            console.log(`Cache expired for ${source}, updating...`)
            cache[rss_list[source].url] = { data: newFeed, expires: moment().add(15, 'm') };
        }

        // Send the feed as response
        res.set('Content-Type', 'text/xml');
        res.send(newFeed.xml())
    } catch (err) {
        return res.status(500).send('Error: Internal Server Error: ' + err)
    }
})

function transformFeed(originalFeed) {
    return {
        title: originalFeed.title,
        description: originalFeed.description,
        feed_url: originalFeed.feedUrl,
        site_url: originalFeed.link,
        image_url: originalFeed.image ? originalFeed.image.url : undefined,
        managingEditor: originalFeed.managingEditor,
        copyright: originalFeed.copyright,
        language: originalFeed.language
    }
}

async function transformItems(input, selector) {
    return await Promise.all(input.map(async (inputItem) => await transformItem(inputItem, selector)));
}

async function transformItem(inputItem, selector) {
    // Selecting identifier
    const identifier = inputItem.guid || inputItem.link || inputItem.title;

    const result = {
        title: inputItem.title,
        description: await parseContent(inputItem.link, selector),
        url: inputItem.link,
        guid: inputItem.guid,
        categories: inputItem.categories,
        author: inputItem.creator,
        date: inputItem.pubDate
    }
    // TODO maybe cache this result after we mess with the description

    return result;
}

//Modify this to produce meaningful content to populate description.
//This could be the solution to proxying content
async function parseContent(url, selector) {
    // Load HTML
    const html = await request(url);

    // Pass HTML into cheerio
    const $ = cheerio.load(html);

    // Gather output html
    let output = $(selector).text();
    return output;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
