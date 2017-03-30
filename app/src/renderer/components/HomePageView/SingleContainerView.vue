<template>
  <div class="layout">
    <Menu mode="horizontal" theme="light" active-name="single-container-menu-active" class="single-container-menu">
      <Button type="ghost" shape="circle" icon="chevron-left" @click="goHome" class="go-home-button"></Button>
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
  import docker from '../../js/docker'

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
