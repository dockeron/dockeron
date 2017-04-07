<template>
  <div>
    <container-control-panel class="container-control-panel"
        :container-id="containerId" :initialize="true" :has-all-buttons="true"
        @container-data-refreshed="refreshContainerData">
    </container-control-panel>
    <Tag class="container-state-tag" :color="stateToColor[status]">
      {{status}}
    </Tag>
    <tree-view :data="containerData" :options="{maxDepth: 1, rootObjectKey: containerId}">
    </tree-view>
  </div>
</template>

<script>
  import ContainerControlPanel from './ContainerControlPanel'
  import TreeView from './TreeView/TreeView'

  export default {
    components: {
      ContainerControlPanel,
      TreeView
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
  .container-control-panel {
    display: inline-block;
    margin-left: 20px;
  }

  .container-state-tag {
    position: absolute;
    right: 3px;
  }
</style>
