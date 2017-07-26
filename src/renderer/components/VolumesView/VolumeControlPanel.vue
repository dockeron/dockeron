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
      fullPanel: {
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
      volumeName (newVolumeName) {
        this.volume = docker.getVolume(newVolumeName)
      }
    },
    methods: {
      removeVolume () {
        const volumeRemoved = (removed) => {
          notify('Volume has been removed!')
          this.$emit('removed')
        }

        this.volume.remove()
          .then(volumeRemoved)
          .catch(notify)
      },
      inspectVolume () {
        const volumeRefreshed = (data) => {
          this.$emit('input', data)
        }

        const refreshErrored = (err) => {
          this.$emit('input', err)
          notify(err)
        }

        this.volume.inspect()
          .then(volumeRefreshed)
          .catch(refreshErrored)
      }
    },
    created () {
      this.volume = docker.getVolume(this.volumeName)
      if (this.fullPanel) {
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
