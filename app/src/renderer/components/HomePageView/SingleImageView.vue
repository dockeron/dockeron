<template>
  <div class="layout">
    <Menu class="single-image-menu" mode="horizontal" active-name="menu-active">
      <Button class="go-home-button" type="ghost" shape="circle" icon="chevron-left"
          @click="goHome">
      </Button>
      <image-control-panel class="image-control-panel" :image-id="imageId"
          @image-data-refreshed="refreshImageData">
      </image-control-panel>
    </Menu>
    <div class="layout-content">
      <pre>{{imageData}}</pre>
    </div>
    <div class="layout-copy">
      2017-2018 &copy; Dockeron
    </div>
  </div>
</template>

<script>
  import ImageControlPanel from './ImageControlPanel'

  export default {
    components: {
      ImageControlPanel
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
  .layout {
    background: #f5f7f9;
    position: relative;
    overflow-y: scroll;
    max-height: 100vh;
    /*height: 100%;*/
  }

  .layout-content {
    min-height: 200px;
  }

  .layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }

  .single-container-menu {
    padding-left: 35px;
  }

  .go-home-button {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
  }

  .image-control-panel {
    margin-left: 20px;
  }
</style>
