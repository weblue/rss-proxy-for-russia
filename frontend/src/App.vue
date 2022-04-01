<template>
  <div id="app">
    <Navbar :lang="lang" @switch-lang="switchLang"/>
    <main class="content">
      <div class="container is-max-desktop p-2">
        <b-message
            :title="lang === 'en'? 'Welcome!' : 'Добро пожаловать! '"
            class="is-info mb-2"
            :aria-close-label="lang === 'en'? 'Close message' : 'Закрыть'">
          <div v-if="lang === 'en'">
            <p>Welcome to the World News Aggregator, a single source that compiles unabridged, up-to-date articles about
              world news from the BBC, AP, and Reuters in one place.</p>
            <p>This site will always be accessible, but if you want to access other websites blocked by the government,
              you can follow these instructions to set up a free VPN (Virtual Private Network).</p>
            <ol>
              <li>Download and install the <a href="https://psiphon.ca/en/download.html?psiphonca" target="_blank">
                Psiphon app</a> that matches your device type.
              </li>
              <li>Open the app and Connect.</li>
              <li>You can change the server region by opening settings (the gear icon) and changing the "Select server
                region" setting.
              </li>
              <li>You are now free to browse sites unrestricted.</li>
            </ol>
          </div>
          <div v-if="lang === 'ru'">
            <p>Добро пожаловать в Агрегатор мировых новостей, единый ресурс, который представляет полные и актуальные
              статьи о мировых новостях от надежных независимых источников.</p>
            <p>Этот сайт всегда будет доступен, а если вы хотите получить доступ к другим веб-сайтам, заблокированным
              правительством, вы можете настроить бесплатную VPN (виртуальную частную сеть), следуя этим
              инструкциям.</p>
            <ol>
              <li>Загрузите и установите приложение <a href="https://psiphon.ca/ru/download.html?psiphonca"
                                                       target="_blank">
                Psiphon</a> для вашего устройства.
              </li>
              <li>Запустите приложение и нажмите «Старт».</li>
              <li>Вы можете изменить страну сервера, открыв настройки (значок шестеренки) и кликнув «Выбор региона
                сервера».
              </li>
              <li>Теперь вы можете свободно просматривать веб-сайты без ограничений.</li>
            </ol>
            <p>Для просмотра подробной инструкции пройдите по <a href="https://www.currenttime.tv/block"
                                                                 target="_blank">ссылке</a>.</p>
          </div>
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
            :open="openCards[i] === 'open'"
            :index="i"
            @switch-open="switchOpen"
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
      skeleton_length: 20,
      articles: new Array(this.skeleton_length).fill(-1),
      lang: 'en',
      eng_sources: ['ap', 'bbc', 'reuters'],
      openCards: new Array(this.skeleton_length).fill('closed')
    }
  },
  mounted() {
    if (localStorage.getItem('lang')) {
      this.lang = localStorage.getItem('lang')
    }
    this.loadArticles();
  },
  methods: {
    loadArticles() {
      this.articles = new Array(this.skeleton_length).fill(-1); // placeholder elements for the card skeleton
      this.openCards = new Array(this.skeleton_length).fill('closed');
      this.loading = true;
      if (this.lang === 'en') {
        for (let i = 0; i < this.eng_sources.length; i++) {
          this.makeApiCall(this.eng_sources[i])
        }
      } else if (this.lang === 'ru') {
        this.makeApiCall('bbc_ru')
      }
    },
    async makeApiCall(source) {
      axios
          .get('/rss_feed?source=' + source)
          .then((response) => {
            xml2js.parseStringPromise(response.data /*, options */).then((result) => {
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
              this.openCards = new Array(this.articles.length).fill('closed');
              this.loading = false;
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
    switchOpen(index){
      if(this.openCards[index] === 'open'){
        this.$set(this.openCards, index, 'closed');
      }else{
        this.$set(this.openCards, index, 'open');
      }
    },
    parseContent(content) {
      return content
          .replace(/U.S./g, "US")
          .replace(/U.N./g, "UN")
          .replace(/U.K./g, "UK")
          .replace(/D.C./g, "DC")
          .replace(/E.U./g, "EU")
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
