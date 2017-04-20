<template>
  <div id="foot-logs">
    <span class="log" v-for="log in value">{{log}}</span>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    watch: {
      value: function (newLogs) {
        console.log(newLogs)
      }
    }
  }
</script>

<style scoped>
  #foot-logs {
    border-radius: 3px;
    border-style: solid;
    border-width: thin;
    border-color: #d7dde4;
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    padding: 0px 3px;
    height: 20px;
    /*max-height: 50px;*/
    /*max-width: 800px;*/
    overflow: scroll;
    background: rgba(255, 255, 255, 1);
    color: #657180;
    white-space: normal;
    z-index: 1;
    resize: vertical;
  }

  .log {
    display: block;
  }

  ::-webkit-resizer {
    border: 2px solid grey;
    box-shadow: 0 0 2px 5px black;

    /*size does not work*/
    position: fixed;
    width: 100% !important;
    height: 10px !important;
  }
</style>
