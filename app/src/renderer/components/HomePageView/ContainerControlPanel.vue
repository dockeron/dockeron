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
        <tree-view :data="topResult" :options="{maxDepth: 1, rootObjectKey: 'Top'}"></tree-view>
      </Modal>
    </div>
  </div>
</template>

<script>
  import TreeView from './TreeView/TreeView'

  import docker from '../../js/docker'
  import notify from '../../js/notify'

  export default {
    components: {
      TreeView
    },
    data () {
      return {
        topProcessesModal: false,
        containerRenameModal: false,
        topResult: {},
        containerNewName: '',
        container: {}
      }
    },
    props: {
      containerId: '',
      initialize: false,
      hasAllButtons: false,
      value: {}
    },
    methods: {
      startContainer () {
        var self = this

        this.container.start()
          .then(function (data) {
            notify('Container ' + self.value.Name + ' started!')
            self.inspectContainer()
          })
          .catch(notify)
      },
      stopContainer () {
        var self = this

        this.container.stop()
          .then(function (data) {
            notify('Container ' + self.value.Name + ' stopped!')
            self.inspectContainer()
          })
          .catch(notify)
      },
      pauseContainer () {
        var self = this
        console.log('Pause: ', self.containerId)

        this.container.pause()
          .then(function (data) {
            notify('Container ' + self.value.Name + ' paused!')
            self.inspectContainer()
          })
          .catch(notify)
      },
      unpauseContainer () {
        var self = this

        this.container.unpause()
          .then(function (data) {
            notify('Container ' + self.value.Name + ' unpaused!')
            self.inspectContainer()
          })
          .catch(notify)
      },
      restartContainer () {
        var self = this

        this.container.restart()
          .then(function (data) {
            notify('Container ' + self.value.Name + ' restarted!')
            self.inspectContainer()
          })
          .catch(notify)
      },
      killContainer () {
        var self = this

        this.container.kill()
          .then(function (data) {
            notify('Container ' + self.value.Name + ' killed!')
            self.inspectContainer()
          })
          .catch(notify)
      },
      inspectContainer () {
        var self = this

        function containerRefreshed (data) {
          self.$emit('container-data-refreshed', data)
        }

        function containerErrored (err) {
          self.$emit('container-data-errored', err)
        }

        this.container.inspect()
          .then(containerRefreshed)
          .catch(containerErrored)
      },
      getContainerLogs () {
        var logOpts = {
          stdout: true,
          stderr: true,
          tail: 10
        }

        this.container.logs(logOpts)
          .then(function (data) {
            console.log('Display logs:')
            console.log(data)
            // console.log(JSON.stringify(JSON.decycle(data)))
            console.log(data.statusCode)
            console.log(data.statusMessage)
          })
          .catch(notify)
      },
      renameContainer () {
        if (this.containerNewName === '') return
        var self = this
        var renamePara = {
          name: self.containerNewName
        }

        function renameContainerFinshed (data) {
          notify('Rename container to ' + renamePara.name + ' successful!')
          self.containerNewName = ''
          self.inspectContainer()
        }

        this.container.rename(renamePara)
          .then(renameContainerFinshed)
          .catch(notify)
      },
      listTopProcesses () {
        var self = this

        this.container.top()
          .then(function (data) {
            self.topResult = data
            self.topProcessesModal = true
          })
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
</style>
