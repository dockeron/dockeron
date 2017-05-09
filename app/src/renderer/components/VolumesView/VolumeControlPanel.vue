<template>
  <div>
    <Button type="error" @click="removeVolume">Remove</Button>
  </div>
</template>

<script>
  import docker from '../../js/docker'
  import notify from '../../js/notify'

  export default {
    props: {
      volumeName: {
        type: String,
        default: ''
      },
      initialize: {
        type: Boolean,
        default: false
      },
      // volume data
      value: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        volume: {}
      }
    },
    watch: {
      volumeName: function (newVolumeName) {
        this.volume = docker.getVolume(newVolumeName)
      }
    },
    methods: {
      removeVolume () {
        // var self = this

        function volumeRemoved (removed) {
          console.log(removed)
          notify('Volume has been removed!')
        }

        this.volume.remove()
          .then(volumeRemoved)
          .catch(notify)
      },
      inspectVolume () {
        var self = this

        function volumeRefreshed (data) {
          self.$emit('input', data)
        }

        function refreshErrored (err) {
          self.$emit('input', err)
          notify(err)
        }

        this.volume.inspect()
          .then(volumeRefreshed)
          .catch(refreshErrored)
      }
    },
    created () {
      this.volume = docker.getVolume(this.volumeName)
      if (this.initialize) {
        this.inspectVolume()
      }
    }
  }
</script>

<style scoped>
  .additional-buttons {
    display: inline-block;
  }
</style>
