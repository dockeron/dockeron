<template>
  <div>
    <volume-control-panel class="volume-control-panel" :volume-name="volumeName"
        v-model="volumeData" :initialize="true">
    </volume-control-panel>
    <br>
    <tree-view :data="volumeData" :options="{rootObjectKey: volumeName}"></tree-view>
  </div>
</template>

<script>
  import VolumeControlPanel from './VolumeControlPanel'
  import TreeView from '../TreeView/TreeView'

  export default {
    components: {
      VolumeControlPanel,
      TreeView
    },
    data () {
      return {
        volumeName: '',
        volumeData: {}
      }
    },
    methods: {
      loadVolumeName () {
        this.volumeName = this.$route.params.volumeName
      }
    },
    created () {
      this.loadVolumeName()
    }
  }
</script>

<style scoped>
  .volume-control-panel {
    margin-left: 20px;
  }
</style>
