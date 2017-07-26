<template>
  <div>
    <Button type="success" @click="connectVolume">Connect</Button>
    <Button type="warning" @click="disconnectVolume">Disconnect</Button>
    <div v-if="fullPanel" class="additional-buttons">
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
      fullPanel: {
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
      networkId (newNetworkId) {
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
        const networkRefreshed = data => {
          this.$emit('input', data)
        }

        const refreshErrored = err => {
          this.$emit('input', err)
          notify(err)
        }

        this.network.inspect()
          .then(networkRefreshed)
          .catch(refreshErrored)
      }
    },
    created () {
      this.network = docker.getNetwork(this.networkId)
      if (this.fullPanel) {
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
