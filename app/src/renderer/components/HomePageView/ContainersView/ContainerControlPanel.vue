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
        <tree-view :data="topResult" :options="{maxDepth: 1, rootObjectKey: 'Top'}"></tree-view>
      </Modal>
    </div>
  </div>
</template>

<script>
  import TreeView from '../TreeView/TreeView'

  import docker from '../../../js/docker'
  import notify from '../../../js/notify'

  export default {
    components: {
      TreeView
    },
    props: {
      containerId: '',
      containerName: '',
      initialize: false,
      hasAllButtons: false,
      value: {}
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
          .catch(notify)
      },
      stopContainer () {
        var self = this

        function containerStopped (data) {
          notify('Container ' + self.containerName + ' stopped!')
          self.inspectContainer()
        }

        this.container.stop()
          .then(containerStopped)
          .catch(notify)
      },
      pauseContainer () {
        var self = this

        function containerPaused (data) {
          notify('Container ' + self.containerName + ' paused!')
          self.inspectContainer()
        }

        this.container.pause()
          .then(containerPaused)
          .catch(notify)
      },
      unpauseContainer () {
        var self = this

        function containerUnpaused (data) {
          notify('Container ' + self.containerName + ' unpaused!')
          self.inspectContainer()
        }

        this.container.unpause()
          .then(containerUnpaused)
          .catch(notify)
      },
      restartContainer () {
        var self = this

        function containerRestarted (data) {
          notify('Container ' + self.containerName + ' restarted!')
          self.inspectContainer()
        }

        this.container.restart()
          .then(containerRestarted)
          .catch(notify)
      },
      killContainer () {
        var self = this

        function containerKilled (data) {
          notify('Container ' + self.containerName + ' killed!')
          self.inspectContainer()
        }

        this.container.kill()
          .then(containerKilled)
          .catch(notify)
      },
      inspectContainer () {
        var self = this

        function containerRefreshed (data) {
          // self.value = data
          self.$emit('input', data)
        }

        function refreshErrored (err) {
          // self.value = err
          self.$emit('input', err)
        }

        this.container.inspect()
          .then(containerRefreshed)
          .catch(refreshErrored)
      },
      getContainerLogs () {
        var self = this
        var logOpts = {
          stdout: true,
          stderr: true,
          tail: 10
        }

        function containerLogsGot (data) {
          data.setEncoding('utf8')

          data.on('data', function (logs) {
            self.logsModal = true
            self.logs = logs
          })
        }

        this.container.logs(logOpts)
          .then(containerLogsGot)
          .catch(notify)
      },
      renameContainer () {
        if (this.containerNewName === '') return
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
          .catch(notify)
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
      // if (this.initialize) {
      this.inspectContainer()
      // }
    }
  }
</script>

<style scoped>
  .additional-buttons {
    display: inline-block;
  }

  .logs {
    white-space: pre-wrap;
  }
</style>
