<template>
  <div id="#app" class="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import store from 'renderer/vuex/store'
  export default {
    store
  }
</script>

<style>
  /*@import url(https://fonts.googleapis.com/css?family=Lato:300);*/

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
