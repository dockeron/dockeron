<template>
  <div>
    <Button
        type="success"
        @click="startContainer()"
        class="container-control-button">
      Start
    </Button>
    <Button
        type="error"
        @click="stopContainer()"
        class="container-control-button">
      Stop
    </Button>
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
      }
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

</style>
