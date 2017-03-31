<template>
  <div class="layout">
    <div class="layout-menu">
      <Menu mode="horizontal" active-name="home-menu-containers">
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
        <Menu-item name="home-menu-settings">
          <Icon type="settings"></Icon>
          Settings
        </Menu-item>
      </Menu>
    </div>
    <div class="layout-content">
      <router-view></router-view>
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

  @media (max-width: 613px) {
    Menu {
      height: 120px;
    }

    Menu-item {
      height: 50%;
    }
  }

</style>
