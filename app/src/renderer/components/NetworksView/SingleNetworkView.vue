<template>
  <div>
    <network-control-panel class="network-control-panel" :network-id="networkId"
        v-model="networkData" :initialize="true" :has-all-buttons="true">
    </network-control-panel>
    <br>
    <tree-view :data="networkData" :options="{rootObjectKey: networkId}"></tree-view>
  </div>
</template>

<script>
  import NetworkControlPanel from './NetworkControlPanel'
  import TreeView from '../TreeView/TreeView'

  export default {
    components: {
      NetworkControlPanel,
      TreeView
    },
    data () {
      return {
        networkId: '',
        networkData: {}
      }
    },
    methods: {
      loadNetworkId () {
        this.networkId = this.$route.params.networkId
      }
    },
    created () {
      this.loadNetworkId()
    }
  }
</script>

<style scoped>
  .network-control-panel {
    margin-left: 20px;
  }
</style>
