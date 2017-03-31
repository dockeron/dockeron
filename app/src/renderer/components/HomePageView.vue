<template>
  <div class="layout">
    <Menu mode="horizontal" theme="light" active-name="home-menu-containers" @on-select="onSelect">
      <Menu-item name="home-menu-containers">
        <Icon type="ios-paper"></Icon>
        <router-link to="/containers" name="containers-view">Containers</router-link>
      </Menu-item>
      <Menu-item name="home-menu-images">
        <Icon type="ios-people"></Icon>
        <router-link to="/images" name="images-view">Images</router-link>
      </Menu-item>
      <Submenu name="home-menu-dockerhub">
        <template slot="title">
          <Icon type="stats-bars"></Icon>
          Docker Hub
        </template>
        <Menu-item name="home-menu-3-1">Top Stars</Menu-item>
        <Menu-item name="home-menu-3-2">Top Pulls</Menu-item>
        <Menu-item name="home-menu-3-4">Login</Menu-item>
        <Menu-item name="home-menu-3-3">Search</Menu-item>
      </Submenu>
      <Menu-item name="home-menu-settings">
        <Icon type="settings"></Icon>
        Settings
      </Menu-item>
    </Menu>
    <div class="layout-content">
      <div class="layout-content-main">
        <router-view></router-view>
      </div>
    </div>
    <div class="layout-copy">
      2017-2018 &copy; Dockeron
    </div>
  </div>
</template>

<script>
  import ContainersView from './HomePageView/ContainersView'
  import ImagesView from './HomePageView/ImagesView'
  export default {
    name: 'home-page',
    components: {
      ContainersView,
      ImagesView
    },
    data () {
      return {
        activeMenuName: 'home-menu-containers'
      }
    },
    methods: {
      onSelect (newActiveMenuName) {
        this.activeMenuName = newActiveMenuName
      }
    }
    // ,
    // watch: {
    // '$route': {
    //     deep: true,
    //     handler: function (to, from) {
    //         this.pageKey = to.path;
    //     }
    // }
    // }
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
    /*margin: 15px;*/
    /*overflow: hidden;*/
    /*background: #fff;*/
    /*border-radius: 4px;*/
  }

  .layout-content-main {
    padding: 10px;
  }

  .layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
</style>
