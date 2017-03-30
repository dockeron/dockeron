<template>
  <div class="layout">
    <Menu mode="horizontal" theme="light" active-name="home-menu-active">
      <Menu-item name="home-menu-1">
        <Icon type="ios-paper"></Icon>
        Containers
      </Menu-item>
      <Menu-item name="home-menu-2">
        <Icon type="ios-people"></Icon>
        Images
      </Menu-item>
      <Submenu name="home-menu-3">
        <template slot="title">
          <Icon type="stats-bars"></Icon>
          Docker Hub
        </template>
        <Menu-item name="home-menu-3-1">Top Stars</Menu-item>
        <Menu-item name="home-menu-3-2">Top Pulls</Menu-item>
        <Menu-item name="home-menu-3-4">Login</Menu-item>
        <Menu-item name="home-menu-3-3">Search</Menu-item>
      </Submenu>
      <Menu-item name="home-menu-4">
        <Icon type="settings"></Icon>
        Settings
      </Menu-item>
    </Menu>
    <div class="layout-content">
      <div class="layout-content-main">
        <containers-view></containers-view>
      </div>
    </div>
    <div class="layout-copy">
      2017-2018 &copy; Dockeron
    </div>
  </div>
</template>

<script>
  import ContainersView from './HomePageView/ContainersView'

  export default {
    name: 'home-page',
    components: {
      ContainersView
    },
    computed: {
      themeColor: function () {
        console.log('changed')
        return (this.theme === 'light') ? 'color: #657180' : 'color: #fff'
      }
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
