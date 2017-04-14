<template>
  <div>
    <Button type="success" @click="startContainer">
      Start
    </Button>
    <Button type="error" @click="stopContainer">
      Stop
    </Button>
    <div v-if="hasAllButtons" class="additional-buttons">
      <Button type="warning" @click="pauseContainer">
        Pause
      </Button>
      <Button type="info" @click="unpauseContainer">
        Unpause
      </Button>
      <Button type="warning" @click="restartContainer">
        Restart
      </Button>
      <Button type="error" @click="killContainer">
        Kill
      </Button>
      <Button type="success" @click="inspectContainer">
        Refresh
      </Button>
      <Button type="info" @click="getContainerLogs">
        Logs
      </Button>
      <Modal v-model="logsModal" title="Logs">
        <pre class="logs">{{logs}}</pre>
      </Modal>
      <Button type="warning" @click="containerRenameModal = true">
        Rename
      </Button>
      <Modal v-model="containerRenameModal" title="Rename Container" @on-ok="renameContainer">
        <Input v-model="containerNewName" placeholder="New Name"></Input>
      </Modal>
      <Button type="success" @click="listTopProcesses">
        Top
      </Button>
      <Modal v-model="topProcessesModal" title="Top Processes">
        <tree-view :data="topResult"></tree-view>
      </Modal>
    </div>
  </div>
</template>

<script>
  import TreeView from '../TreeView/TreeView'

  import docker from '../../js/docker'
  import notify from '../../js/notify'

  function errorAndRefresh (err) {
    notify(err)
    // bind function to this during usage
    this.inspectContainer()
  }

  export default {
    components: {
      TreeView
    },
    props: {
      containerId: {
        type: String,
        default: ''
      },
      containerName: {
        type: String,
        default: ''
      },
      initialize: {
        type: Boolean,
        default: false
      },
      hasAllButtons: {
        type: Boolean,
        default: false
      },
      // container data
      value: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        topProcessesModal: false,
        containerRenameModal: false,
        logsModal: false,
        logs: '',
        topResult: {},
        containerNewName: '',
        container: {}
      }
    },
    methods: {
      startContainer () {
        var self = this

        function containerStarted (data) {
          notify('Container ' + self.containerName + ' started!')
          self.inspectContainer()
        }

        this.container.start()
          .then(containerStarted)
          .catch(errorAndRefresh.bind(this))
      },
      stopContainer () {
        var self = this

        function containerStopped (data) {
          notify('Container ' + self.containerName + ' stopped!')
          self.inspectContainer()
        }

        this.container.stop()
          .then(containerStopped)
          .catch(errorAndRefresh.bind(this))
      },
      pauseContainer () {
        var self = this

        function containerPaused (data) {
          notify('Container ' + self.containerName + ' paused!')
          self.inspectContainer()
        }

        this.container.pause()
          .then(containerPaused)
          .catch(errorAndRefresh.bind(this))
      },
      unpauseContainer () {
        var self = this

        function containerUnpaused (data) {
          notify('Container ' + self.containerName + ' unpaused!')
          self.inspectContainer()
        }

        this.container.unpause()
          .then(containerUnpaused)
          .catch(errorAndRefresh.bind(this))
      },
      restartContainer () {
        var self = this

        function containerRestarted (data) {
          notify('Container ' + self.containerName + ' restarted!')
          self.inspectContainer()
        }

        this.container.restart()
          .then(containerRestarted)
          .catch(errorAndRefresh.bind(this))
      },
      killContainer () {
        var self = this

        function containerKilled (data) {
          notify('Container ' + self.containerName + ' killed!')
          self.inspectContainer()
        }

        this.container.kill()
          .then(containerKilled)
          .catch(errorAndRefresh.bind(this))
      },
      inspectContainer () {
        var self = this

        function containerRefreshed (data) {
          self.$emit('input', data)
        }

        function refreshErrored (err) {
          self.$emit('input', err)
          notify(err)
        }

        this.container.inspect()
          .then(containerRefreshed)
          .catch(refreshErrored)
      },
      getContainerLogs () {
        // TODO (fluency03) : more options to get the logs
        var self = this
        var logOpts = {
          stdout: true,
          stderr: true,
          tail: 20
        }

        function containerLogsGot (data) {
          data.setEncoding('utf8')
          self.logsModal = true

          data.on('data', function (logs) {
            self.logs = logs
          })
        }

        this.container.logs(logOpts)
          .then(containerLogsGot)
          .catch(notify)
      },
      renameContainer () {
        if (this.containerNewName === '') {
          notify('Container name cannot be empty!')
          return
        }
        var self = this
        var renameParams = {
          name: self.containerNewName
        }

        function containerRenamed (data) {
          notify('Rename container to ' + renameParams.name + ' successful!')
          self.containerNewName = ''
          self.inspectContainer()
        }

        this.container.rename(renameParams)
          .then(containerRenamed)
          .catch(errorAndRefresh.bind(this))
      },
      listTopProcesses () {
        var self = this

        function topProcessesGot (data) {
          self.topResult = data
          self.topProcessesModal = true
        }

        this.container.top()
          .then(topProcessesGot)
          .catch(notify)
      }
    },
    created () {
      this.container = docker.getContainer(this.containerId)
      if (this.initialize) {
        this.inspectContainer()
      }
    }
  }
</script>

<style scoped>
  .additional-buttons {
    display: inline-block;
  }

  .logs {
    white-space: normal;
  }
</style>
