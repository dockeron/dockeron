<template>
  <div>
    <Button type="success" @click="connectVolume">Connect</Button>
    <Button type="warning" @click="disconnectVolume">Disconnect</Button>
    <div v-if="hasAllButtons" class="additional-buttons">
      <Button type="error" @click="removeVolume">Remove</Button>
    </div>
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
      hasAllButtons: {
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
    watch: {
      networkId: function (newNetworkId) {
        this.network = docker.getNetwork(newNetworkId)
      }
    },
    methods: {
      connectVolume () {
        // TODO (fluency03)
      },
      removeVolume () {
        // TODO (fluency03)
      },
      disconnectVolume () {
        // TODO (fluency03)
      },
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
  .additional-buttons {
    display: inline-block;
  }
</style>
