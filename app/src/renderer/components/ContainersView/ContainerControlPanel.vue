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
      <Button type="warning" @click="containerRenameModal = true">
        Rename
      </Button>
      <Modal v-model="containerRenameModal" title="Rename Container" @on-ok="renameContainer">
        <Input v-model="containerNewName" placeholder="New Name"></Input>
      </Modal>
      <Button type="error" @click="removeContainerModal = true">
        Remove
      </Button>
      <Modal v-model="removeContainerModal" title="Do you want to remove this cintainer?"
          @on-ok="removeContainer">
        Remove the volumes associated with the container:
        <i-switch v-model="rmcParams.v" size="large">
          <span slot="open">True</span>
          <span slot="close">False</span>
        </i-switch>
        <br>
        Force remove:
        <i-switch v-model="rmcParams.force" size="large">
          <span slot="open">True</span>
          <span slot="close">False</span>
        </i-switch>
        <br>
        Remove the specified link associated with the container:
        <i-switch v-model="rmcParams.link" size="large">
          <span slot="open">True</span>
          <span slot="close">False</span>
        </i-switch>
      </Modal>
      <Button type="success" @click="psArgsModal = true">
        Top
      </Button>
      <Modal v-model="psArgsModal" title="ps arguments" @on-ok="listTopProcesses">
        <Input class="args-input" v-model="psArgs" placeholder="-ef">
          <span slot="prepend">ps</span>
        </Input>
      </Modal>
      <Modal v-model="topProcessesModal" title="Top Processes">
        <tree-view :data="topResult"></tree-view>
      </Modal>
    </div>
    <foot-logs-view v-model="footLogs"></foot-logs-view>
  </div>
</template>

<script>
  import TreeView from '../TreeView/TreeView'
  import FootLogsView from '../FootLogsView'

  import docker from '../../js/docker'
  import notify from '../../js/notify'

  function errorAndRefresh (err) {
    notify(err)
    // bind function to this during usage
    this.inspectContainer()
  }

  export default {
    components: {
      TreeView,
      FootLogsView
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
        logs: '',
        topResult: {},
        containerNewName: '',
        container: {},
        footLogs: {},
        psArgsModal: false,
        psArgs: '',
        removeContainerModal: false,
        rmcParams: {
          v: false,
          force: false,
          link: false
        }
      }
    },
    methods: {
      startContainer () {
        var self = this

        function containerStarted (data) {
          notify('Container ' + self.containerName + ' started!')
          self.inspectContainer()
        }

        // TODO (fluency03): detachKeys - Override the key sequence for detaching a container
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

        // TODO (fluency03): Number of seconds to wait before killing the container
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

        // TODO (fluency03): Number of seconds to wait before killing the container
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

        var queries = {
          size: true
        }

        function containerRefreshed (data) {
          self.$emit('input', data)
        }

        function refreshErrored (err) {
          self.$emit('input', err)
          notify(err)
        }

        this.container.inspect(queries)
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

        this.$set(self.footLogs, 'runningLog', '')

        function containerLogsGot (data) {
          data.setEncoding('utf8')

          data.on('data', function (logs) {
            self.$set(self.footLogs, 'runningLog', self.footLogs.runningLog + logs)
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
      removeContainer () {
        var self = this

        function containerRemoved (data) {
          notify('Container removed!')
          self.$router.push({
            name: 'containers-view'
          })
        }

        this.container.remove(this.rmcParams)
          .then(containerRemoved)
          .catch(notify)
      },
      listTopProcesses () {
        var self = this

        var topParams = {
          ps_args: this.psArgs
        }

        function topProcessesGot (data) {
          self.topResult = data
          self.topProcessesModal = true
          self.psArgs = '-ef'
        }

        this.container.top(topParams)
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

  .args-input {
    width: 30%;
  }
</style>
