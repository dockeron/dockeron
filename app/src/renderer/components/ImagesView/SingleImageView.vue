<template>
  <div>
    <image-control-panel class="image-control-panel" :image-id="imageId"
        v-model="imageData" :full-panel="true">
    </image-control-panel>
    <br>
    <tree-view :data="imageData" :options="{rootObjectKey: imageId}"></tree-view>
  </div>
</template>

<script>
  import ImageControlPanel from './ImageControlPanel'
  import TreeView from '../TreeView/TreeView'

  export default {
    components: {
      ImageControlPanel,
      TreeView
    },
    data () {
      return {
        imageId: '',
        imageData: {},
        stateToColor: {
          created: 'blue',
          restarting: 'yellow',
          running: 'green',
          paused: 'yellow',
          exited: 'red',
          dead: 'red'
        },
        status: 'exited'
      }
    },
    methods: {
      loadImageId () {
        this.imageId = this.$route.params.imageId
      }
    },
    created () {
      this.loadImageId()
    }
  }
</script>

<style scoped>
  .image-control-panel {
    margin-left: 20px;
  }
</style>
