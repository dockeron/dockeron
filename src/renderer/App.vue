<template>
  <div id="app" class="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'dockeron'
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
  }

  .app {
    height: 100%;
    overflow: hidden;
    ::-webkit-scrollbar {display:none;}
  }
</style>
