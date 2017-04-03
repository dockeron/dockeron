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
        <Submenu name="home-menu-dockerhub">
          <template slot="title">
            <Icon type="stats-bars"></Icon>
            Docker Hub
          </template>
          <Menu-item name="home-menu-dockerhub-topstars">Top Stars</Menu-item>
          <Menu-item name="home-menu-dockerhub-toppulls">Top Pulls</Menu-item>
          <Menu-item name="home-menu-dockerhub-login">Login</Menu-item>
          <Menu-item name="home-menu-dockerhub-search">Search</Menu-item>
        </Submenu>
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
      <pre>{{info}}</pre>
    </Modal>
    <Modal v-model="showVersion" title="Version">
      <pre>{{version}}</pre>
    </Modal>
    <div class="layout-copy">
      2017-2018 &copy; Dockeron
    </div>
  </div>
</template>

<script>
  import ContainersView from './HomePageView/ContainersView'
  import ImagesView from './HomePageView/ImagesView'

  import docker from '../js/docker'

  export default {
    name: 'home-page',
    data () {
      return {
        activeMenu: 'home-menu-containers',
        routeToMenu: {
          '/containers': 'home-menu-containers',
          '/images': 'home-menu-images'
        },
        info: {},
        version: {},
        ping: '',
        showInfo: false,
        showVersion: false
      }
    },
    components: {
      ContainersView,
      ImagesView
    },
    methods: {
      onMenuSelect (selectedMenuName) {
        if (selectedMenuName === 'home-menu-settings-info') {
          this.showInfo = true
        } else if (selectedMenuName === 'home-menu-settings-version') {
          this.showVersion = true
        } else if (selectedMenuName === 'home-menu-settings-ping') {
          /* eslint-disable no-new */
          new Notification('Dockeron', {
            body: 'The network is ' + this.ping + ' !'
          })
        } else {
          console.log(selectedMenuName)
        }
      },
      loadActiveMenu () {
        this.activeMenu = this.routeToMenu[this.$route.fullPath] || 'home-menu-containers'
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
      this.loadActiveMenu()
    }
  }
</script>

<style scoped>
  .layout {
    background: #f5f7f9;
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
