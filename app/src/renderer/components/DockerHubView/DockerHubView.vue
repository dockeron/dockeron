<template>
  <div>
    <div class="docker-hub-panel">
      <search-panel v-model="searchedImages"></search-panel>
      <login-panel v-model="token"></login-panel>
    </div>
    <br><br>
    <Card v-for="image in searchedImages" class="image-card">
      <p slot="title" class="image-card-title">
        {{image.name}}
        <Tag class="image-star-count-tag" color="blue">
          {{image.star_count}}
        </Tag>
      </p>
      <p>
        <Tooltip>
          Description: {{image.description.slice(0, 20)}} ...
          <div slot="content" class="description-pop">
            {{image.description}}
          </div>
        </Tooltip>
      </p>
      <p>
        Official:
        <Tag :color="booleanToTagColor[image.is_official]">{{image.is_official}}</Tag>
        Automated:
        <Tag :color="booleanToTagColor[image.is_automated]">{{image.is_automated}}</Tag>
      </p>
      <Button type="primary" icon="archive" @click="pullImage(image.name)">
        Pull
      </Button>
    </Card>
    <pre class="foot-logs" v-if="pullProcess">{{pullProcess}}</pre>
  </div>
</template>

<script>
  import SearchPanel from './SearchPanel'
  import LoginPanel from './LoginPanel'

  import docker from '../../js/docker'
  import notify from '../../js/notify'
  import dockerHubApi from '../../js/dockerHubApi'

  export default {
    components: {
      SearchPanel,
      LoginPanel
    },
    data () {
      return {
        token: '',
        searchedImages: [],
        booleanToTagColor: {
          'true': 'green',
          'false': 'red'
        },
        pullProcessModal: false,
        pullProcess: ''
      }
    },
    methods: {
      getOfficialRepos () {
        var self = this

        function officialReposGot (data) {
          notify('Docker Hub: ' + data.results.length + ' images loaded!')
          self.searchedImages = data.results
          self.searchedImages.forEach(function (image) {
            image.is_official = true
          })
        }

        dockerHubApi.repository()
          .then(officialReposGot)
          .catch(notify)
      },
      pullImage (imageName) {
        var self = this
        function imagePulled (stream) {
          self.pullProcessModal = true

          function onFinished (err, output) {
            self.pullProcess = ''
            if (err) {
              notify(err)
              return
            }
            notify('New image is pulled!')
          }

          function onProgress (event) {
            self.pullProcess = JSON.stringify(event)
          }

          docker.modem.followProgress(stream, onFinished, onProgress)
        }

        docker.pull(imageName)
          .then(imagePulled)
          .catch(notify)
      }
    },
    created () {
      this.getOfficialRepos()
    }
  }
</script>

<style scoped>
  .docker-hub-panel {
    display: inline-block;
    float: right;
    width: 350px;
  }

  .image-card {
    width: 300px;
    display: inline-block;
    margin: 5px 5px;
  }

  .image-card-title {
    height: 26px;
  }

  .image-star-count-tag {
    position: absolute;
    right: 3px;
  }

  .description-pop {
    white-space: normal;
  }

  .foot-logs {
    position: fixed;
    left: 0;
    bottom: 0;
    max-width: 1000px;
    background: rgba(100, 100, 100, 0.5);
    white-space: normal;
  }
</style>
