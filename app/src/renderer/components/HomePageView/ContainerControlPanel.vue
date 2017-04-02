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
    </div>
  </div>
</template>

<script>
  import docker from '../../js/docker'

  export default {
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
