<template>
  <div>
    <!-- <Button type="error" @click="removeVolume">Remove</Button> -->
  </div>
</template>

<script>
  import docker from '../../js/docker'
  import notify from '../../js/notify'

  export default {
    props: {
      networkId: {
        type: String,
        default: ''
      },
      initialize: {
        type: Boolean,
        default: false
      },
      // network data
      value: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        network: {}
      }
    },
    methods: {
      // removeVolume () {
      //   // var self = this
      //
      //   function volumeRemoved (removed) {
      //     console.log(removed)
      //     notify('Volume has been removed!')
      //   }
      //
      //   this.volume.remove()
      //     .then(volumeRemoved)
      //     .catch(notify)
      // },
      inspectNetwork () {
        var self = this

        function networkRefreshed (data) {
          self.$emit('input', data)
        }

        function refreshErrored (err) {
          self.$emit('input', err)
          notify(err)
        }

        this.network.inspect()
          .then(networkRefreshed)
          .catch(refreshErrored)
      }
    },
    created () {
      this.network = docker.getNetwork(this.networkId)
      if (this.initialize) {
        this.inspectNetwork()
      }
    }
  }
</script>

<style scoped>

</style>
