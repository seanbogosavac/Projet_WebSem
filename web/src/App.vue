<script lang="ts">
  import { defineComponent } from 'vue'
  import TopBar from './components/TopBar.vue'

  export default defineComponent({
    name: "App",
    components: {
      TopBar
    }
  })
</script>

<template>
  <TopBar />
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
  html, body {
    margin: 0;
    padding: 0;
}</style>