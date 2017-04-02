<template>
  <div class="layout">
    <Menu class="single-container-menu" mode="horizontal" active-name="menu-active">
      <Button class="go-home-button" type="ghost" shape="circle" icon="chevron-left"
          @click="goHome">
      </Button>
      <container-control-panel class="container-control-panel"
          :container-id="containerId" :initialize="true"
          @container-data-refreshed="refreshContainerData">
      </container-control-panel>
      <Tag class="container-state-tag" :color="stateToColor[status]">
        {{status}}
      </Tag>
    </Menu>
    <div class="layout-content">
      <pre>{{containerData}}</pre>
    </div>
    <div class="layout-copy">
      2017-2018 &copy; Dockeron
    </div>
  </div>
</template>

<script>
  import ContainerControlPanel from './ContainerControlPanel'

  export default {
    components: {
      ContainerControlPanel
    },
    data () {
      return {
        containerId: '',
        containerData: {},
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
    watch: {
      containerData: function (newContainerData) {
        try {
          this.status = newContainerData.State.Status
        } catch (e) {
          console.log(e)
          this.status = 'exited'
        }
      }
    },
    methods: {
      goHome () {
        this.$router.push({
          name: 'containers-view',
          params: { activeMenu: 'home-menu-containers' }
        })
      },
      loadContainerId () {
        this.containerId = this.$route.params.containerId
      },
      refreshContainerData (newData) {
        this.containerData = newData
      }
    },
    created () {
      this.loadContainerId()
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

  .container-control-panel {
    margin-left: 20px;
  }

  .container-state-tag {
    position: absolute;
    right: 3px;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
