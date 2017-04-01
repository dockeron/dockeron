<template>
  <div>
    <Button
        type="success"
        @click="startContainer(containerId, inspectContainer)"
        class="container-control-button">
      Start
    </Button>
    <Button
        type="error"
        @click="stopContainer(containerId, inspectContainer)"
        class="container-control-button">
      Stop
    </Button>
  </div>
</template>

<script>
  import docker from '../../js/docker'

  export default {
    props: {
      containerId: String
    },
    methods: {
      startContainer (containerId, callback) {
        console.log('Start: ', containerId)
        var container = docker.getContainer(containerId)

        container.start()
          .then(function (data) {
            console.log('Started!')
            callback()
          })
          .catch(console.warn)
      },
      stopContainer (containerId, callback) {
        console.log('Stop: ', containerId)
        var container = docker.getContainer(containerId)

        container.stop()
          .then(function (data) {
            console.log('Stopped!')
            callback()
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
      this.inspectContainer()
    }
  }
</script>

<style scoped>

</style>
