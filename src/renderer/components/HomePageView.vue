<template>
  <div class="layout">
    <div class="layout-menu">
      <Menu mode="horizontal" active-name="menu-containers" @on-select="onMenuSelect">
        <Menu-item name="menu-containers">
          <Icon type="cube"></Icon>
          <router-link :to="pathFromRoot(route.CONTAINERS_VIEW_PATH)">Containers</router-link>
        </Menu-item>
        <Menu-item name="menu-images">
          <Icon type="beer"></Icon>
          <router-link :to="pathFromRoot(route.IMAGES_VIEW_PATH)">Images</router-link>
        </Menu-item>
        <Menu-item name="menu-volumes">
          <Icon type="help-buoy"></Icon>
          <router-link :to="pathFromRoot(route.VOLUMES_VIEW_PATH)">Volumes</router-link>
        </Menu-item>
        <Menu-item name="menu-networks">
          <Icon type="link"></Icon>
          <router-link :to="pathFromRoot(route.NETWORKS_VIEW_PATH)">Networks</router-link>
        </Menu-item>
        <Menu-item name="menu-plugins">
          <Icon type="gear-b"></Icon>
          <router-link :to="pathFromRoot(route.PLUGINS_VIEW_PATH)">Plugins</router-link>
        </Menu-item>
        <Menu-item name="menu-docker-hub">
          <Icon type="stats-bars"></Icon>
          <router-link :to="pathFromRoot(route.DOCKER_HUB_VIEW_PATH)">Docker Hub</router-link>
        </Menu-item>
        <Submenu name="menu-settings">
          <template slot="title">
            <Icon type="settings"></Icon>
            Settings
          </template>
          <Menu-item name="menu-settings-info">
            <Icon type="chatbubble-working"></Icon>
            Info
          </Menu-item>
          <Menu-item name="menu-settings-version">
            <Icon type="pricetag"></Icon>
            Version
          </Menu-item>
          <Menu-item name="menu-settings-ping">
            <Icon type="wifi"></Icon>
            Ping
          </Menu-item>
          <Menu-item name="menu-settings-config">
            <Icon type="edit"></Icon>
            Config
          </Menu-item>
        </Submenu>
      </Menu>
    </div>
    <div class="layout-content">
      <router-view></router-view>
    </div>
    <Modal v-model="showInfo" title="Info">
      <tree-view :data="info"></tree-view>
    </Modal>
    <Modal v-model="showVersion" title="Version">
      <tree-view :data="version"></tree-view>
    </Modal>
    <div class="layout-copy">
      2017-2018 &copy; Dockeron
    </div>
  </div>
</template>

<script>
  import TreeView from './TreeView/TreeView'

  import docker from '../js/docker'
  import notify from '../js/notify'
  import Route from '../js/constants/RouteConstants'

  export default {
    name: 'home-page',
    components: {
      TreeView
    },
    data () {
      return {
        info: {},
        version: {},
        ping: '',
        showInfo: false,
        showVersion: false,
        route: Route
      }
    },
    methods: {
      onMenuSelect (selectedMenuName) {
        switch (selectedMenuName) {
          case 'menu-settings-info':
            this.showInfo = true
            break
          case 'menu-settings-version':
            this.showVersion = true
            break
          case 'menu-settings-ping':
            this.loadPing()
            notify(`The network is ${this.ping} !`)
            break
          default:
            break
        }
      },
      loadInfo () {
        const updateInfo = info => {
          this.info = info
        }

        docker.info()
          .then(updateInfo)
          .catch(notify)
      },
      loadVersion () {
        const updateVersion = version => {
          this.version = version
        }

        docker.version()
          .then(updateVersion)
          .catch(notify)
      },
      loadPing () {
        const updateNetwork = ping => {
          this.ping = ping
        }

        docker.ping()
          .then(updateNetwork)
          .catch(notify)
      },
      pathFromRoot (subPath) {
        return Route.HOME_PAGE_PATH + subPath
      }
    },
    created () {
      this.loadInfo()
      this.loadVersion()
      this.loadPing()
    }
  }
</script>

<style scoped>
  .layout {
    height: 100%;
    position: relative;
    overflow: auto;
    ::-webkit-scrollbar {display:none;}
  }

  .layout-menu {
    -webkit-app-region: drag;
  }

  .ivu-menu {
    margin-top: 5px;
    height: 55px;
  }

  .layout-content {
    min-height: 200px;
    overflow: auto;
    ::-webkit-scrollbar {display:none;}
    max-height: 100vh;
    padding: 10px;
  }

  .layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }

  a {
    color: inherit;
  }

  @media (max-width: 850px) {
    .ivu-menu {
      display: inline-table;
    }
  }

</style>
