<template>
  <div>
    <Button class="container-control-button" type="success" @click="startContainer">
      Start
    </Button>
    <Button class="container-control-button" type="error" @click="stopContainer">
      Stop
    </Button>
    <div v-if="hasAllButtons" class="additional-buttons">
      <Button class="container-control-button" type="warning" @click="pauseContainer">
        Pause
      </Button>
      <Button class="container-control-button" type="info" @click="unpauseContainer">
        Unpause
      </Button>
      <Button class="container-control-button" type="warning" @click="restartContainer">
        Restart
      </Button>
      <Button class="container-control-button" type="error" @click="killContainer">
        Kill
      </Button>
      <Button class="container-control-button" type="success" @click="inspectContainer">
        Refresh
      </Button>
      <Button class="container-control-button" type="info" @click="getContainerLogs">
        Logs
      </Button>
      <Button class="container-control-button" type="warning" @click="containerRenameModal = true">
        Rename
      </Button>
      <Modal v-model="containerRenameModal" title="Rename Container" @on-ok="renameContainer">
          <Input v-model="containerNewName" placeholder="New Name"></Input>
      </Modal>
      <Button class="container-control-button" type="success" @click="listTopProcesses">
        Top
      </Button>
      <Modal v-model="topProcessesModal" title="Top Processes">
        <container-top-processes-form ref="containerTopProcessesForm" v-bind:topResult="topResult"></container-top-processes-form>
      </Modal>
    </div>
  </div>
</template>

<script>
  import docker from '../../js/docker'
  import ContainerTopProcessesForm from './ContainerTopProcessesForm'

  export default {
    components: {
      ContainerTopProcessesForm
    },
    data () {
      return {
        topProcessesModal: false,
        containerRenameModal: false,
        topResult: {},
        containerNewName: ''
      }
    },
    props: {
      containerId: String,
      initialize: {
        type: Boolean,
        default: false
      },
      hasAllButtons: false
    },
    methods: {
      startContainer () {
        var self = this
        console.log('Start: ', self.containerId)
        var container = docker.getContainer(self.containerId)

        container.start()
          .then(function (data) {
            console.log('Started!')
            self.inspectContainer()
          })
          .catch(console.warn)
      },
      stopContainer () {
        var self = this
        console.log('Stop: ', self.containerId)
        var container = docker.getContainer(self.containerId)

        container.stop()
          .then(function (data) {
            console.log('Stopped!')
            self.inspectContainer()
          })
          .catch(console.warn)
      },
      pauseContainer () {
        var self = this
        console.log('Pause: ', self.containerId)
        var container = docker.getContainer(self.containerId)

        container.pause()
          .then(function (data) {
            console.log('Paused!')
            self.inspectContainer()
          })
          .catch(console.warn)
      },
      unpauseContainer () {
        var self = this
        console.log('Unpause: ', self.containerId)
        var container = docker.getContainer(self.containerId)
        console.log(container)

        container.unpause()
          .then(function (data) {
            console.log('Unpaused!')
            self.inspectContainer()
          })
          .catch(console.warn)
      },
      restartContainer () {
        var self = this
        console.log('Restart: ', self.containerId)
        var container = docker.getContainer(self.containerId)

        container.restart()
          .then(function (data) {
            console.log('Restarted!')
            self.inspectContainer()
          })
          .catch(console.warn)
      },
      killContainer () {
        var self = this
        console.log('Kill: ', self.containerId)
        var container = docker.getContainer(self.containerId)

        container.kill()
          .then(function (data) {
            console.log('Killed!')
            self.inspectContainer()
          })
          .catch(console.warn)
      },
      inspectContainer () {
        var self = this
        var container = docker.getContainer(self.containerId)

        function containerRefreshed (data) {
          console.log('inspect: ', data)
          self.$emit('container-data-refreshed', data)
        }

        function containerErrored (err) {
          console.log('inspect: ', err)
          self.$emit('container-data-errored', err)
        }

        container.inspect()
          .then(containerRefreshed)
          .catch(containerErrored)
      },
      getContainerLogs () {
        var self = this
        console.log('get logs from container: ', self.containerId)
        var container = docker.getContainer(self.containerId)
        var logOpts = {
          stdout: true,
          stderr: true,
          tail: 10
        }
        container.logs(logOpts)
          .then(function (data) {
            console.log('Display logs:')
            console.log(data)
            // console.log(JSON.stringify(JSON.decycle(data)))
            console.log(data.statusCode)
            console.log(data.statusMessage)
          })
          .catch(console.warn)
      },
      renameContainer () {
        if (this.containerNewName === '') return
        var self = this
        var renamePara = {
          name: self.containerNewName
        }
        var container = docker.getContainer(self.containerId)

        function renameContainerFinshed (data) {
          console.log('Rename: ' + self.containerId + ' to ' + renamePara.name)
          /* eslint-disable no-new */
          new Notification('Dockeron', {
            body: 'Rename container to ' + renamePara.name + ' successful!'
          })
          self.containerNewName = ''
          self.inspectContainer()
        }

        function renameContainerFailed (error) {
          console.log(error)
          var errorMsg = error.message
          errorMsg = errorMsg.slice(errorMsg.indexOf(':') + 2)
          self.containerNewName = ''
          /* eslint-disable no-new */
          new Notification('Dockeron', {
            body: errorMsg
          })
        }

        container.rename(renamePara)
          .then(renameContainerFinshed)
          .catch(renameContainerFailed)
      },
      listTopProcesses () {
        var self = this
        console.log('List top processes of: ' + self.containerId)
        var container = docker.getContainer(self.containerId)

        container.top()
          .then(function (data) {
            console.log(data)
            self.topResult = data
            self.topProcessesModal = true
          })
          .catch(console.warn)
      }
    },
    created () {
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
</style>
