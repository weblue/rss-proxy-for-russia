<template>
  <div id="app">
    <Navbar :lang="lang" @switch-lang="switchLang"/>
    <main class="content">
      <div class="container is-max-desktop p-2">
        <b-message
            :title="lang === 'en'? 'Welcome!' : 'Добро пожаловать! '"
            class="is-info"
            :aria-close-label="lang === 'en'? 'Close message' : 'закрыть'">
          <p v-if="lang === 'en'">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id fermentum quam.
            Proin sagittis, nibh id
            hendrerit imperdiet, elit sapien laoreet elit</p>
          <p v-if="lang === 'ru'">Put russian welcome message here</p>
        </b-message>
        <Article
          v-for="(a, i) in articles"
          :key="'article-'+i"
          :title="a.title"
          :link="a.link"
          :content="a.content"
          :source="a.source"
          :timestamp="a.date"
          :loading="loading"
          :lang="lang"
        />
      </div>
    </main>
    <Footer :lang="lang"/>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Article from "@/components/Article";
import axios from "axios";
import xml2js from 'xml2js';

export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
    Article
  },
  data() {
    return {
      loading: true,
      articles: new Array(20).fill(-1),
      lang: 'en',
      eng_sources: ['ap', 'bbc', 'reuters']
    }
  },
  mounted() {
    if(localStorage.getItem('lang')){
      this.lang = localStorage.getItem('lang')
    }
    this.loadArticles();
  },
  methods: {
    loadArticles(){
      this.articles = new Array(20).fill(-1); // placeholder elements for the card skeleton
      this.loading = true;
      if(this.lang === 'en'){
        for(let i = 0; i < this.eng_sources.length; i++){
          this.makeApiCall(this.eng_sources[i])
        }
      } else if (this.lang === 'ru'){
        this.makeApiCall('bbc_ru')
      }
    },
    async makeApiCall(source) {
      axios
          .get('/rss_feed?source='+source)
          .then((response) => {
            xml2js.parseStringPromise(response.data /*, options */).then((result) => {
              console.log(result.rss.channel[0])
              result.rss.channel[0].item.forEach(el => {
                // prevent duplicates
                if (!this.articles.find(x => x.link === el.link[0])) {
                  this.articles.unshift({
                    title: el.title[0],
                    content: el.description ? this.parseContent(el.description[0]) : '',
                    date: new Date(el.pubDate[0]),
                    link: el.link[0],
                    source: result.rss.channel[0].title[0]
                  })
                }
              });
              // remove placeholder items
              this.articles = this.articles.filter(x => x !== -1);
              // sort by date
              this.articles.sort((a, b) => b.date - a.date);
              this.loading = false;
              console.log(this.articles);
            })
                .catch((err) => {
                  console.log(err);
                  this.$buefy.toast.open({
                    duration: 5000,
                    message: this.lang === 'en' ? `Something went wrong trying to load news articles.` : 'Что-то пошло не так. Пожалуйста, повторите попытку позже',
                    position: 'is-bottom',
                    type: 'is-danger'
                  })
                })
          });
    },
    switchLang() {
      if (this.lang === 'en') {
        this.lang = 'ru';
        localStorage.setItem("lang", "ru")
      } else if (this.lang === 'ru') {
        this.lang = 'en';
        localStorage.setItem("lang", "en")
      }
      this.loadArticles();
    },
    parseContent(content){
      return content
          .replace(/U.S./g, "US")
          .replace(/D.C./g, "DC")
          .split(/(?<=[a-z])(?=[B{2}C])|(?<=[.?!])(?=[A-Z])/)
          .map(p => {
            if (p.charAt(p.length - 1) !== '.' && p.charAt(p.length - 1) !== '?' && p.charAt(p.length - 1) !== '!' && p.charAt(p.length - 1) !== '"') {
              return p + '.'
            } else {
              return p
            }
      })
    }
  }
}
</script>

<style>
html, body {
  background-color: #e9e9e9 !important;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1 0 auto;
}

.footer {
  flex-shrink: 0;
}

header > p {
  margin: 0 !important;
}

.subtitle {
  color: #444;
  font-size: 0.9rem !important;
  padding-bottom: 0.5em;
}

a:not(.button):not(.navbar-item):not(.navbar-burger):not(.icon):not(.card-header-icon) {
  color: #167df0;
}

a:hover {
  text-decoration: underline;
}
</style>
