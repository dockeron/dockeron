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

        container.start(function (err, data) {
          if (!err) {
            console.log('data: ', data)
          } else {
            console.log('err: ', err)
          }
          callback()
        })
      },
      stopContainer (containerId, callback) {
        console.log('Stop: ', containerId)
        var container = docker.getContainer(containerId)

        container.stop(function (err, data) {
          if (!err) {
            console.log('data: ', data)
          } else {
            console.log('err: ', err)
          }
          callback()
        })
      },
      inspectContainer () {
        var self = this
        var container = docker.getContainer(self.containerId)

        container.inspect(function (err, data) {
          if (!err) {
            console.log('data: ', data)
            self.$emit('container-data-refreshed', data)
          } else {
            console.log('err: ', err)
            self.$emit('container-data-errored', err)
          }
        })
      }
    },
    created () {
      this.inspectContainer()
    }
  }
</script>

<style scoped>

</style>
