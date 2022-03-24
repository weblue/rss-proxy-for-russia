import Parser from "rss-parser";
import express from 'express';
import RSS from "rss";
import moment from "moment";
const app = express()
const port = 3000

const rss_list = {
    bbc_ru: "http://feeds.bbci.co.uk/russian/rss.xml",
    bbc: "http://feeds.bbci.co.uk/news/world-60525350/rss.xml",
    ap: "https://www.pipes.digital/feed/1NjYgr9z", // AP World News
    reuters: "https://www.pipes.digital/feed/1NklLJOR" // Reuters Ukraine
}

const cache = {
    data: "",
    expires: moment()
}

app.use(express.static('dist'))

app.get('/rss_feed', async (req, res) => {
    try {
        // Get the original feed
        let originalFeed;

        try {
            let source = req.query.source || 'ap';
            originalFeed = await new Parser({
                customFields: {
                    feed: ["image", "managingEditor", "copyright", "language"]
                }
            }).parseURL(rss_list[source]);
            //TODO combine all these rss files and serve as one?
        } catch (err) {
            return res.status(400).send('Error: Cannot parse feed.');
        }

        // Create the new feed from the original one
        let newFeed;

        // Return cached element if available, probably just do this in memory instead of with redis
        newFeed = new RSS(transformFeed(originalFeed))

        // TODO make separate caches for each language
        /*if(cache.expires.isAfter(moment())) {
            newFeed = cache.data;
        } else {
            newFeed = new RSS(transformFeed(originalFeed))

            // Cache result
            cache.data = newFeed;
            cache.expires = moment().add(15, 'm');
            console.log("Cache expired, updating...")
        }*/

        // Transform and add all items to the feed
        const transformedItems = await transformItems(originalFeed.items);
        transformedItems.forEach((item) => {
            newFeed.item(item);
        })

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
        language: originalFeed.language,
        content: originalFeed.content
    }
}

async function transformItems(input) {
    return await Promise.all(input.map(async (inputItem) => await transformItem(inputItem)));
}

async function transformItem(inputItem) {
    // Selecting identifier
    const identifier = inputItem.guid || inputItem.link || inputItem.title;

    const result = {
        title: inputItem.title,
        description: inputItem.description, //await parseContent(inputItem.link, selectors),
        url: inputItem.link,
        guid: inputItem.guid,
        categories: inputItem.categories,
        author: inputItem.creator,
        date: inputItem.pubDate,
        content: inputItem.content
    }
    // TODO maybe cache this result after we mess with the description

    return result;
}

//TODO maybe use this? it reads the web page and does stuff with it
//Modify this to produce meaningful content to populate description.
//This could be the solution to proxying content
async function parseContent(url, selectors) {
    // Load HTML
    const html = await request(url);

    // Pass HTML into cheerio
    const $ = cheerio.load(html);

    // Gather output html
    let output = '';
    for (let selector of selectors) {
        output += $(selector);
    }

    return output;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})