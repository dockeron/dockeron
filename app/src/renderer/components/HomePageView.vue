<template>
  <div class="layout">
    <Menu mode="horizontal" :theme="theme" active-name="home-menu-1" :active-key="pageKey" @on-select="onSelect">
      <Menu-item name="home-menu-1" v-link="{path: '/contianers'}" key="contianers">
        <Icon type="ios-paper"></Icon>
        Containers
      </Menu-item>
      <Menu-item name="home-menu-2" v-link="{path: '/images'}" key="images">
        <Icon type="ios-people"></Icon>
        Images
      </Menu-item>
      <!-- <Submenu name="home-menu-3" v-link="{path: '/docker-hub'}"> -->
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
      <Menu-item name="home-menue-4">
      <!-- <Menu-item name="home-menue-4" v-link="{path: '/settings'}"> -->
        <Icon type="settings"></Icon>
        Settings
      </Menu-item>
      <Radio-group v-model="theme" class="theme-choice" :style="themeColor">
        <Radio label="light"></Radio>
        <Radio label="dark"></Radio>
        <Radio label="primary"></Radio>
      </Radio-group>
    </Menu>
    <div class="layout-content">
      <div class="layout-content-main">
        <router-view></router-view>
        <!-- <containers-view></containers-view> -->
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
    data () {
      return {
        theme: 'light'
      }
    },
    methods: {
      onSelect: function (menuItem) {
        console.log('set active ' + menuItem)
      }
    },
    computed: {
      themeColor: function () {
        console.log('theme changed')
        return (this.theme === 'light') ? 'color: #657180' : 'color: #fff'
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

  .theme-choice {
    position: absolute;
    right: 3px;
    color: #fff;
  }

  @media (max-width: 690px) {
    .theme-choice {
      display: none;
    }
  }
</style>
