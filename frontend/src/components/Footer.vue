<template>
  <footer class="footer has-background-grey-dark has-text-light p-3">
    <p>{{ lang === 'en' ? 'World News Aggregator' : 'Агрегатор мировых новостей' }}</p>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  props: {
    lang: {
      type: String,
      default: 'en'
    }
  }
}
</script>

<style scoped>

</style>
