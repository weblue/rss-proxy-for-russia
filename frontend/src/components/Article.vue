<template>
  <b-collapse
      class="card mb-4"
      animation="slide"
      aria-id="contentIdForA11y3"
      :open="open">
    <template #trigger="props" >
      <div
          class="card-header"
          role="button"
          aria-controls="contentIdForA11y3"
          :aria-expanded="props.open"
      >
        <div class="is-flex is-flex-grow-1 is-flex-direction-column is-justify-content-center ml-3">
          <a v-if="!loading" class="card-header-title m-0 pb-0 pl-2" :href="link" target="_blank">{{ title }}</a>
          <div class="is-flex is-flex-direction-row is-marginless is-paddingless" v-if="!loading">
            <span class="subtitle m-0 px-2">{{ source }} - </span>
            <vue-moments-ago class="subtitle" v-if="lang=== 'en'" prefix="posted" suffix="ago" :date="timestamp" lang="en" />
            <span class="subtitle" v-if="lang === 'ru'"> {{ timestamp.toLocaleString('ru-RU')}}</span>
          </div>
          <b-skeleton size="is-medium" width="75%" :active="loading"></b-skeleton>
        </div>
        <a class="card-header-icon" >
          <b-icon
              pack="fas"
              size="is-small"
              :icon="props.open ? 'angle-down' : 'angle-up'">
          </b-icon>
        </a>
      </div>
    </template>

    <div class="card-content">
      <div class="content">
        <div v-if="!loading">
          <p v-for="(p,i) in content" :key="'paragraph-'+i">{{ p }}</p>
        </div>
        <b-skeleton size="is-medium" :active="loading" :count="3"></b-skeleton>
      </div>
    </div>
  </b-collapse>

</template>

<script>

import VueMomentsAgo from 'vue-moments-ago'

export default {
  name: "Article",
  components: {
    VueMomentsAgo
  },
  props: {
    lang: {
      type: String,
      default: 'en'
    },
    loading: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: 'Title'
    },
    timestamp: {
      default: new Date().toLocaleDateString()
    },
    source: {
      type: String,
      default: 'Source'
    },
    content: {
      type: String || Array,
      default: 'This is sample content.'
    },
    link: {
      type: String,
      default: ''
    },
    open: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>

</style>
