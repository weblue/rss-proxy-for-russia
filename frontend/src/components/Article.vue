<template>
  <b-collapse
      class="card mb-4"
      animation="slide"
      aria-id="contentIdForA11y3"
      :open="open"
      @open="$emit('switch-open', index)">
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
          <div v-if="props.open">
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns:href="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-angle-down"><path fill="#363636" d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z" class=""></path></svg>
          </div>
          <div v-else>
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-up" role="img" xmlns:href="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-angle-up"><path fill="#363636" d="M352 352c-8.188 0-16.38-3.125-22.62-9.375L192 205.3l-137.4 137.4c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25C368.4 348.9 360.2 352 352 352z" class=""></path></svg>
          </div>
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
    },
    index: {
      type: Number
    }
  }
}
</script>

<style scoped>

</style>
