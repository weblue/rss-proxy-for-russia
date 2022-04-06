<template>
  <b-navbar :mobile-burger="false">
    <template #brand>
      <b-navbar-item>
        <b-navbar-item>
          <img
              src="../assets/ru-rss.png"
              alt="World News Aggregator Logo"
          >
        </b-navbar-item>
        <b-navbar-item v-bind:class="{'p-0': isMobile}">
          <strong v-if="isMobile">WNA</strong>
          <strong v-else>{{ lang === 'en' ? 'World News Aggregator' : 'Агрегатор мировых новостей' }}</strong>
        </b-navbar-item>
      </b-navbar-item>
      <b-navbar-item tag="div">
        <div class="buttons">
          <a class="button is-primary" @click="switchLang">
            <strong>{{ lang === 'en' ? 'русский ' : 'English' }}</strong>
          </a>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {
  name: "Navbar",
  props: {
    lang: {
      type: String,
      default: 'en'
    }
  },
  data(){
    return{
      isMobile: window.innerWidth < 768
    }
  },
  methods: {
    switchLang(){
      this.$emit('switch-lang')
    }
  }
}
</script>

<style scoped>

</style>
