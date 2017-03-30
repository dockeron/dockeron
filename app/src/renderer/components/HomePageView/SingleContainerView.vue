<template>
  <div class="layout">
    <Menu mode="horizontal" theme="light" active-name="single-container-menu-active" class="single-container-menu">
      <Button type="ghost" shape="circle" icon="chevron-left" @click="goHome" class="go-home-button"></Button>
      <!-- <Menu-item name="single-container-menu-1">
        <Icon type="ios-paper"></Icon>
        Containers
      </Menu-item>
      <Menu-item name="single-container-menu-2">
        <Icon type="ios-people"></Icon>
        Images
      </Menu-item>
      <Submenu name="single-container-menu-3">
        <template slot="title">
          <Icon type="stats-bars"></Icon>
          Docker Hub
        </template>
        <Menu-group title="使用">
          <Menu-item name="single-container-menu-3-1">新增和启动</Menu-item>
          <Menu-item name="single-container-menu-3-2">活跃分析</Menu-item>
          <Menu-item name="single-container-menu-3-3">时段分析</Menu-item>
        </Menu-group>
        <Menu-group title="留存">
          <Menu-item name="single-container-menu-3-4">用户留存</Menu-item>
          <Menu-item name="single-container-menu-3-5">流失用户</Menu-item>
        </Menu-group>
      </Submenu>
      <Menu-item name="single-container-menu-4">
        <Icon type="settings"></Icon>
        Settings
      </Menu-item> -->
    </Menu>
    <div class="layout-content">
      <div class="layout-content-main">
        <!--  -->
        <pre>{{containerData}}</pre>
      </div>
    </div>
    <div class="layout-copy">
      2017-2018 &copy; Dockeron
    </div>
  </div>
</template>

<script>
  var Docker = require('dockerode')
  var fs = require('fs')

  var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock'
  var stats = fs.statSync(socket)

  if (!stats.isSocket()) {
    throw new Error('Are you sure the docker is running?')
  }

  var docker = new Docker({ socketPath: socket })

  export default {
    data () {
      return {
        containerId: '',
        containerData: {}
      }
    },
    methods: {
      goHome () {
        this.$router.push({
          name: 'home-page'
        })
      },
      loadContainerId () {
        this.containerId = this.$route.params.containerId
      },
      inspectContainer () {
        var self = this
        // var Docker = require('dockerode')
        // var fs = require('fs')
        //
        // var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock'
        // var stats = fs.statSync(socket)
        //
        // if (!stats.isSocket()) {
        //   throw new Error('Are you sure the docker is running?')
        // }
        //
        // var docker = new Docker({ socketPath: socket })
        var container = docker.getContainer(this.containerId)

        container.inspect(function (err, data) {
          if (!err) {
            console.log(data)
            self.containerData = data
          } else {
            console.log(err)
          }
        })
      }
    },
    created () {
      this.loadContainerId()
      this.inspectContainer()
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
    /*overflow-y: scroll;
    max-height: 100vh;*/
    /*background: #fff;*/
    /*border-radius: 4px;*/
  }

  .layout-content-main {
    padding: 10px;
    /*overflow-y: scroll;
    max-height: 100vh;*/
  }

  .layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }

  .single-container-menu {
    padding-left: 35px;
  }

  .go-home-button {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
