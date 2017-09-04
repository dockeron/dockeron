<template>
  <div class="status-bar">
    <Button class="status-item" type="text" icon="chevron-up" size="small"></Button>
    <Button class="status-item" type="text" icon="refresh" size="small" @click="refresh"></Button>
    <Poptip class="status-item" trigger="hover" placement="top-end">
      <Button type="text" size="small" icon="clipboard"></Button>
      <div slot="content">
        <div v-for="event in events" >
          <Tag v-if="event.time">{{timeFromEpic(event.time)}}</Tag>
          <Tag v-if="event.scope">{{event.scope}}</Tag>
          <Tag v-if="event.Type">{{event.Type}}</Tag>
          <Tag v-if="event.Action">{{event.Action}}</Tag>
          <Tag v-if="event.from">{{event.Actor.Attributes.name}}</Tag>
        </div>
      </div>
    </Poptip>
    <login-panel class="status-item"></login-panel>
    <Tag class="status-item" color="blue">{{info.Images}}</Tag>
    <Button class="status-item" type="text" size="small" icon="beer">
      images
    </Button>
    <Tag class="status-item" color="yellow">{{info.ContainersPaused}}</Tag>
    <Tag class="status-item" color="red">{{info.ContainersStopped}}</Tag>
    <Tag class="status-item" color="green">{{info.ContainersRunning}}</Tag>
    <Button class="status-item" type="text" size="small" icon="cube">
      containers
    </Button>
  </div>
</template>

<script>
  import LoginPanel from './DockerHubView/LoginPanel'

  import updateInfo from '../js/updateInfo'
  import updateVersion from '../js/updateVersion'

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
        events: [],
        info: {
          ContainersPaused: 0,
          ContainersStopped: 0,
          ContainersRunning: 0,
          Images: 0
        },
        version: {}
      }
    },
    methods: {
      refresh () {
        updateInfo(this)
        updateVersion(this)
      },
      timeFromEpic (time) {
        return new Date(time * 1000).toISOString()
      }
    },
    created () {
      this.refresh()
      this.$store.watch(state => state.events.events, newEvents => {
        this.events = newEvents
      })
      this.$store.watch(state => state.info.info, newInfo => {
        this.info = newInfo
      })
    }
  }
</script>

<style scoped>
  .status-bar {
    border-style: solid;
    border-width: thin;
    border-color: #d7dde4;
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    padding: 0px 0px;
    height: 27px;
    /*max-height: 50px;*/
    /*max-width: 800px;*/
    background: rgba(255, 255, 255, 1);
    color: #657180;
    white-space: normal;
    /*overflow: auto;*/
    z-index: 1;
    /*resize: vertical;*/
    transition: height 1s;
  }

  /*.status-bar:hover {
    height: 20%;
  }*/

  .status-item {
    float: right;
    /*margin-right: 3px;*/
  }

  .refresh-button {
    position: absolute;
    right: 0px;
    /*top: 2px;*/
  }
</style>
