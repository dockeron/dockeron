<template>
  <div>
    <Button
        type="primary"
        :loading="loadingContainers"
        icon="ios-loop-strong"
        @click="refreshContainers"
        class="refresh-button">
      <span v-if="!loadingContainers">Refresh</span>
      <span v-else>Loading...</span>
    </Button>
    <br>
    <div v-if="hasFoundContainers">
      <Card v-for="c in containers" class="container-card">
        <p slot="title" class="container-card-title">
          Container: {{c.Names[0]}}
          <Tag :color="stateToColor[c.State]" class="container-state-tag">{{c.State}}</Tag>
        </p>
        <p>Image: {{c.Image}}</p>
        <p>Status: {{c.Status}}</p>
        <Button type="warning" @click="inspectContainer(c.Id)">Inspect</Button>
        <container-control-panel
            :container-id="c.Id"
            @container-data-refreshed="function (newData) { loadContainers() }"
            class="control-panel">
        </container-control-panel>
      </Card>
    </div>
    <div v-else>
      <h4>No containers found.</h4>
      <pre>{{error}}</pre>
    </div>
  </div>
</template>

<script>
  import ContainerControlPanel from './ContainerControlPanel'

  import docker from '../../js/docker'

  export default {
    components: {
      ContainerControlPanel
    },
    data () {
      return {
        containers: [],
        hasFoundContainers: false,
        error: {},
        stateToColor: {
          created: 'blue',
          restarting: 'yellow',
          running: 'green',
          paused: 'yellow',
          exited: 'red',
          dead: 'red'
        },
        loadingContainers: false
      }
    },
    watch: {
      containers: function (newContainers) {
        this.hasFoundContainers = typeof newContainers !== 'undefined' && newContainers !== null && newContainers.length > 0
      }
    },
    methods: {
      refreshContainers () {
        // TODO (fluency03): figure out how to use notifications.
        // this.info('Start loading containers.')
        this.loadingContainers = true
        this.loadContainers()
        // this.info('Finish loading containers.')
        this.loadingContainers = false
      },
      inspectContainer (containerId) {
        console.log('Goto single-container-view: ', containerId)
        this.$router.push({
          name: 'single-container-view',
          params: { containerId: containerId }
        })
      },
      info (content) {
        this.$Notice.info({
          title: content,
          desc: ''
        })
      },
      success (content) {
        this.$Notice.success({
          title: content,
          desc: ''
        })
      },
      warning (content) {
        this.$Notice.warning({
          title: content,
          desc: ''
        })
      },
      error (content) {
        this.$Notice.error({
          title: content,
          desc: ''
        })
      },
      loadContainers () {
        var self = this

        var queries = {
          all: true,
          size: true
        }

        function updateContainers (containers) {
          console.log('listContainers: ', containers)
          self.containers = containers
          self.error = {}
        }

        function updateError (err) {
          console.log('listContainers: ', err)
          self.containers = []
          self.error = err
        }

        docker.listContainers(queries)
          .then(updateContainers)
          .catch(updateError)
      }
    },
    created () {
      this.loadContainers()
    }
  }
</script>

<style scoped>
  .container-card {
    width: 300px;
    display: inline-block;
    margin-right: 10px;
  }

  .container-card-title {
    height: 26px;
  }

  .refresh-button {
    display: block;
  }

  .control-panel {
    display: inline-block;
  }

  .container-state-tag {
    position: absolute;
    right: 3px;
  }
</style>
