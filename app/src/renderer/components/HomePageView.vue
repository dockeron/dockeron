<template>
  <div class="layout">
    <div class="layout-menu">
      <Menu mode="horizontal" :active-name="activeMenu" @on-select="onMenuSelect">
        <Menu-item name="home-menu-containers">
          <Icon type="ios-paper"></Icon>
          <router-link to="/containers">Containers</router-link>
        </Menu-item>
        <Menu-item name="home-menu-images">
          <Icon type="ios-people"></Icon>
          <router-link to="/images">Images</router-link>
        </Menu-item>
        <Menu-item name="home-menu-plugins">
          <Icon type="ios-people"></Icon>
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
          <Menu-item name="home-menu-settings-info">Info</Menu-item>
          <Menu-item name="home-menu-settings-version">Version</Menu-item>
          <Menu-item name="home-menu-settings-ping">Ping</Menu-item>
          <Menu-item name="home-menu-settings-config">Config</Menu-item>
        </Submenu>
      </Menu>
    </div>
    <div class="layout-content">
      <router-view></router-view>
    </div>
    <Modal v-model="showInfo" title="Info">
      <tree-view :data="info" :options="{maxDepth: 1, rootObjectKey: 'Info'}">
      </tree-view>
    </Modal>
    <Modal v-model="showVersion" title="Version">
      <tree-view :data="version" :options="{maxDepth: 1, rootObjectKey: 'Version'}">
      </tree-view>
    </Modal>
    <div class="layout-copy">
      2017-2018 &copy; Dockeron
    </div>
  </div>
</template>

<script>
  import ContainersView from './HomePageView/ContainersView'
  import ImagesView from './HomePageView/ImagesView'
  import TreeView from './HomePageView/TreeView/TreeView'

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
        activeMenu: 'home-menu-containers',
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
            notify('The network is ' + this.ping + ' !')
            break
          default:
            console.log(selectedMenuName)
        }
      },
      loadInfo () {
        var self = this
        docker.info().then(function (data) {
          self.info = data
        }, function (err) {
          console.log(err)
        })
      },
      loadVersion () {
        var self = this
        docker.version().then(function (data) {
          self.version = data
        }, function (err) {
          console.log(err)
        })
      },
      loadPing () {
        var self = this
        docker.ping().then(function (data) {
          console.log('ping: ', data)
          self.ping = data
        }, function (err) {
          console.log(err)
        })
      }
    },
    created () {
      this.loadInfo()
      this.loadVersion()
      this.loadPing()
      // this.loadActiveMenu()
    }
  }
</script>

<style scoped>
  .layout {
    /*background: #f5f7f9;*/
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
