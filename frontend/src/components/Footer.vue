<template>
  <footer class="footer has-background-grey-dark has-text-light p-3">
    <p v-if="lang === 'en'">Footer Content</p>
    <p v-if="lang === 'ru'">Russian Footer Content</p>
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