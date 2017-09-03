<template>
  <div class="layout">
    <div class="layout-menu">
      <Menu mode="horizontal" active-name="menu-containers" @on-select="onMenuSelect">
        <Menu-item name="menu-containers">
          <Icon type="cube"></Icon>Containers
        </Menu-item>
        <Menu-item name="menu-images">
          <Icon type="beer"></Icon>Images
        </Menu-item>
        <Menu-item name="menu-volumes">
          <Icon type="help-buoy"></Icon>Volumes
        </Menu-item>
        <Menu-item name="menu-networks">
          <Icon type="link"></Icon>Networks
        </Menu-item>
        <Menu-item name="menu-plugins">
          <Icon type="gear-b"></Icon>Plugins
        </Menu-item>
        <Menu-item name="menu-docker-hub">
          <Icon type="stats-bars"></Icon>Docker Hub
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
      &copy; Dockeron, 2017
    </div>
    <status-bar></status-bar>
  </div>
</template>

<script>
  import TreeView from './TreeView/TreeView'
  import StatusBar from './StatusBar'

  import docker from '../js/docker'
  import notify from '../js/notify'
  import * as Route from '../js/constants/RouteConstants'

  export default {
    name: 'home-page',
    components: {
      TreeView,
      StatusBar
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
        console.log(selectedMenuName)
        switch (selectedMenuName) {
          case 'menu-containers':
            this.$router.push({
              path: Route.HOME_PAGE_PATH + Route.CONTAINERS_VIEW_PATH
            })
            break
          case 'menu-images':
            this.$router.push({
              path: Route.HOME_PAGE_PATH + Route.IMAGES_VIEW_PATH
            })
            break
          case 'menu-volumes':
            this.$router.push({
              path: Route.HOME_PAGE_PATH + Route.VOLUMES_VIEW_PATH
            })
            break
          case 'menu-networks':
            this.$router.push({
              path: Route.HOME_PAGE_PATH + Route.NETWORKS_VIEW_PATH
            })
            break
          case 'menu-plugins':
            this.$router.push({
              path: Route.HOME_PAGE_PATH + Route.PLUGINS_VIEW_PATH
            })
            break
          case 'menu-docker-hub':
            this.$router.push({
              path: Route.HOME_PAGE_PATH + Route.DOCKER_HUB_VIEW_PATH
            })
            break
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
            console.log('default')
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

      docker.getEvents()
        .then(events => {
          events.setEncoding('utf8')

          events.on('data', data => {
            let event = JSON.parse(data)
            console.log(event)
            this.$store.commit('UPDATE_EVENT', event)
          })
        })
        .catch(notify)
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
