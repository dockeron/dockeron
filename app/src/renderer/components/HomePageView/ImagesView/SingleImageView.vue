<template>
  <div>
    <image-control-panel class="image-control-panel" :image-id="imageId" v-model="imageData"
        @image-data-refreshed="refreshImageData" :initialize="true" :has-all-buttons="true">
    </image-control-panel>
    <br>
    <tree-view :data="imageData" :options="{maxDepth: 1, rootObjectKey: imageId}"></tree-view>
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
      goHome () {
        this.$router.push({
          name: 'images-view',
          params: { activeMenu: 'home-menu-images' }
        })
      },
      loadImageId () {
        this.imageId = this.$route.params.imageId
      },
      refreshImageData (newData) {
        this.imageData = newData
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
