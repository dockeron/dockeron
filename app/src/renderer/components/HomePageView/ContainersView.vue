<template>
  <div>
    <Button type="primary" :loading="loadingContainers" icon="ios-loop-strong" @click="refreshContainers" class="refresh-button">
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
        <Button type="primary" @click="moreIsOpened = true">More</Button>
        <Button type="warning" @click="inspectContainer(c.Id)">Inspect</Button>
        <Button type="success" @click="startContainer(c.Id)">Start</Button>
        <Button type="error" @click="stopContainer(c.Id)">Stop</Button>
        <Modal
          v-model="moreIsOpened"
          :title="c.Names[0]"
          @on-ok="ok"
          @on-cancel="cancel">
            <pre>{{c}}</pre>
        </Modal>
      </Card>
    </div>
    <div v-else>
      <h4>No containers found.</h4>
      <pre>{{error}}</pre>
    </div>
  </div>
</template>

<script>
  import docker from '../../js/docker'

  export default {
    data () {
      return {
        containers: [],
        hasFoundContainers: false,
        error: '',
        stateToColor: {
          created: 'blue',
          restarting: 'yellow',
          running: 'green',
          paused: 'yellow',
          exited: 'red',
          dead: 'red'
        },
        moreIsOpened: false,
        loadingContainers: false
      }
    },
    watch: {
      containers: function (newContainers) {
        this.hasFoundContainers = typeof newContainers !== 'undefined' && newContainers !== null && newContainers.length > 0
      }
    },
    methods: {
      ok () {
        console.log('Open More.')
      },
      cancel () {
        console.log('Close More.')
      },
      refreshContainers () {
        // this.info('Start loading containers.')
        this.loadingContainers = true
        this.loadContainers()
        // this.info('Finish loading containers.')
        this.loadingContainers = false
      },
      inspectContainer (containerId) {
        console.log('Inspect: ', containerId)
        this.$router.push({
          name: 'single-container',
          params: { containerId: containerId }
        })
      },
      startContainer (containerId) {
        console.log('Start: ', containerId)
        var container = docker.getContainer(containerId)

        container.start(function (err, data) {
          if (!err) {
            console.log(data)
          } else {
            console.log(err)
          }
        })
      },
      stopContainer (containerId) {
        console.log('Stop: ', containerId)
        var container = docker.getContainer(containerId)

        container.stop(function (err, data) {
          if (!err) {
            console.log(data)
          } else {
            console.log(err)
          }
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

        docker.listContainers(queries, function (err, containers) {
          if (!err) {
            console.log(containers)
          } else {
            console.log(err)
          }
          self.containers = containers
          self.error = err
        })
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

  .container-state-tag {
    position: absolute;
    right: 3px;
  }
</style>
