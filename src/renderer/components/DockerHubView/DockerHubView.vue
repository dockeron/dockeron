<template>
  <div>
    <div class="docker-hub-panel">
      <search-panel v-model="searchedImages"></search-panel>
      <login-panel></login-panel>
    </div>
    <br><br>
    <Card v-for="image in searchedImages" :key="image.name" class="image-card">
      <p slot="title" class="image-card-title">
        {{image.name}}
        <Tag class="image-star-count-tag" color="blue">{{image.star_count}}</Tag>
      </p>
      <p>
        <Tooltip>
          Description: {{image.description.slice(0, 20)}} ...
          <div slot="content" class="description-pop">{{image.description}}</div>
        </Tooltip>
      </p>
      <p>
        Official:
        <Tag :color="booleanToTagColor[image.is_official]">{{image.is_official}}</Tag>
        Automated:
        <Tag :color="booleanToTagColor[image.is_automated]">{{image.is_automated}}</Tag>
      </p>
      <Button type="primary" icon="archive" @click="pullImage(image.name)">Pull</Button>
    </Card>
    <foot-logs-view v-model="footLogs"></foot-logs-view>
  </div>
</template>

<script>
  import SearchPanel from './SearchPanel'
  import LoginPanel from './LoginPanel'
  import FootLogsView from '../FootLogsView'

  import docker from '../../js/docker'
  import notify from '../../js/notify'
  import { repository } from '../../js/DockerHubApi'

  export default {
    components: {
      SearchPanel,
      LoginPanel,
      FootLogsView
    },
    data () {
      return {
        searchedImages: [],
        booleanToTagColor: {
          true: 'green',
          false: 'red'
        },
        footLogs: {}
      }
    },
    methods: {
      getOfficialRepos () {
        const officialReposGot = data => {
          notify(`Docker Hub: ${data.results.length} images loaded!`)
          this.searchedImages = data.results
          /* eslint no-param-reassign: ["error", { "props": false }] */
          this.searchedImages.forEach(image => {
            image.is_official = true
          })
        }

        repository()
          .then(officialReposGot)
          .catch(notify)
      },
      pullImage (imageName) {
        this.$set(this.footLogs, 'pullLog', '')

        const imagePulled = stream => {
          const onFinished = (err, output) => {
            this.$delete(this.footLogs, 'pullLog')
            if (err) {
              notify(err)
              return
            }
            notify('New image is pulled!')
          }

          const onProgress = event => {
            this.$set(this.footLogs, 'pullLog', JSON.stringify(event))
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
</style>
