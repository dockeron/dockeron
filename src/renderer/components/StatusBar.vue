<template>
  <div class="status-bar">
    <Poptip trigger="hover" placement="top-start">
      <Button size="small">Events</Button>
      <div slot="content">
        <div v-for="event in events" >
          <Tag v-if="event.time">{{new Date(event.time * 1000)}}</Tag>
          <Tag v-if="event.scope">{{event.scope}}</Tag>
          <Tag v-if="event.Type">{{event.Type}}</Tag>
          <Tag v-if="event.Action">{{event.Action}}</Tag>
          <Tag v-if="event.from">{{event.Actor.Attributes.name}}</Tag>
        </div>
      </div>
    </Poptip>
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
        events: []
      }
    },
    methods: {
      refresh () {
        this.events = this.$store.state.status.events
      }
    },
    created () {
      this.refresh()
      this.$store.watch(state => state.status.events, newEvents => {
        this.events = newEvents
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

  /*.status-bar:hover {
    height: 20%;
  }*/

  .refresh-button {
    position: absolute;
    right: 0px;
    /*top: 2px;*/
  }
</style>
