<template>
  <div class="layout">
    <div class="layout-menu">
      <Menu mode="horizontal" active-name="home-menu-containers" @on-select="onMenuSelect">
        <Menu-item name="home-menu-containers">
          <Icon type="cube"></Icon>
          <router-link to="/containers">Containers</router-link>
        </Menu-item>
        <Menu-item name="home-menu-images">
          <Icon type="beer"></Icon>
          <router-link to="/images">Images</router-link>
        </Menu-item>
        <Menu-item name="home-menu-volumns">
          <Icon type="help-buoy"></Icon>
          Volumns
        </Menu-item>
        <Menu-item name="home-menu-plugins">
          <Icon type="gear-b"></Icon>
          Plugins
        </Menu-item>
        <Menu-item name="home-menu-dockerhub">
          <Icon type="stats-bars"></Icon>
          <router-link to="/docker-hub">Docker Hub</router-link>
        </Menu-item>
        <Submenu name="home-menu-settings">
          <template slot="title">
            <Icon type="settings"></Icon>
            Settings
          </template>
          <Menu-item name="home-menu-settings-info">
            <Icon type="chatbubble-working"></Icon>
            Info
          </Menu-item>
          <Menu-item name="home-menu-settings-version">
            <Icon type="pricetag"></Icon>
            Version
          </Menu-item>
          <Menu-item name="home-menu-settings-ping">
            <Icon type="wifi"></Icon>
            Ping
          </Menu-item>
          <Menu-item name="home-menu-settings-config">
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
  import ContainersView from './ContainersView/ContainersView'
  import ImagesView from './ImagesView/ImagesView'
  import TreeView from './TreeView/TreeView'

  import docker from '../js/docker'
  import notify from '../js/notify'

  export default {
    name: 'home-page',
    components: {
      ContainersView,
      ImagesView,
      TreeView
    },
    data () {
      return {
        info: {},
        version: {},
        ping: '',
        showInfo: false,
        showVersion: false
      }
    },
    methods: {
      onMenuSelect (selectedMenuName) {
        switch (selectedMenuName) {
          case 'home-menu-settings-info':
            this.showInfo = true
            break
          case 'home-menu-settings-version':
            this.showVersion = true
            break
          case 'home-menu-settings-ping':
            this.loadPing()
            notify('The network is ' + this.ping + ' !')
            break
          default:
            console.log(selectedMenuName)
        }
      },
      loadInfo () {
        var self = this

        function updateInfo (info) {
          self.info = info
        }

        docker.info()
          .then(updateInfo)
          .catch(notify)
      },
      loadVersion () {
        var self = this

        function updateVersion (version) {
          self.version = version
        }

        docker.version()
          .then(updateVersion)
          .catch(notify)
      },
      loadPing () {
        var self = this

        function updateNetwork (ping) {
          self.ping = ping
        }

        docker.ping()
          .then(updateNetwork)
          .catch(notify)
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
    overflow-y: scroll;
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

  @media (max-width: 637px) {
    .ivu-menu {
      display: inline-table;
    }
  }

</style>
