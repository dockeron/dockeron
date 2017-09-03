<template>
  <div class="status-bar">
    <Tag>{{event.Action}}</Tag>
    <Tag>{{event.Type}}</Tag>
    <Tag>{{event.from}}</Tag>
    <Tag>{{new Date(event.time * 1000)}}</Tag>
    <login-panel></login-panel>
  </div>
</template>

<script>
  import LoginPanel from './DockerHubView/LoginPanel'

  export default {
    components: {
      LoginPanel
    },
    props: {
      value: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        event: {}
      }
    },
    methods: {
      refresh () {
        this.event = this.$store.state.status.event
      }
    },
    created () {
      this.refresh()
      this.$store.watch(state => state.status.event, newEvent => {
        this.event = newEvent
      })
    }
  }
</script>

<style scoped>
  .status-bar {
    /*border-radius: 3px;*/
    border-style: solid;
    border-width: thin;
    border-color: #d7dde4;
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    padding: 0px 3px;
    height: 28px;
    /*max-height: 50px;*/
    /*max-width: 800px;*/
    background: rgba(255, 255, 255, 1);
    color: #657180;
    white-space: normal;
    overflow: auto;
    z-index: 1;
    /*resize: vertical;*/
    transition: height 1s;
  }

  .status-bar:hover {
    height: 20%;
  }

  .refresh-button {
    position: absolute;
    right: 0px;
    /*top: 2px;*/
  }

  .log {
    white-space: pre-wrap;
    display: block;
  }
</style>
