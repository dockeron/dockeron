<template>
  <div>
    <Button class="refresh-button" type="primary" icon="refresh"
        :loading="loadingImages" @click="refreshImages">
      <span v-if="!loadingImages">Refresh</span>
      <span v-else>Loading...</span>
    </Button>
    <Button class="container-operation-button" type="primary" icon="plus-round"
        @click="imagePullModal = true">
      Pull
    </Button>
    <Modal v-model="imagePullModal" title="Pull Image" @on-ok="pullImage" @on-cancel="repoTag = ''">
      Image Name (and Tag): <Input v-model="repoTag"></Input>
    </Modal>
    <br>
    <div v-if="hasFoundImages">
      <Card v-for="image in images" class="image-card">
        <p slot="title" class="image-card-title">
          {{getImageName(image.RepoTags[0])}}
        </p>
        <p>
          Tags: <Tag v-for="tag in getTags(image.RepoTags)">{{tag}}</Tag>
        </p>
        <p>Size: {{formatBytes(image.Size)}}</p>
        <p>Created: {{getDateTime(image.Created)}}</p>
        <Button type="primary" @click="inspectImage(image.Id)">
          Inspect
        </Button>
        <image-control-panel class="control-panel" :image-id="image.Id"
            @image-data-refreshed="function (newData) { loadImages() }"
            @image-removed="function (removed) { loadImages() }">
        </image-control-panel>
      </Card>
    </div>
    <div v-else>
      <h4>No images found.</h4
      <pre>{{error}}</pre>
    </div>
  </div>
</template>

<script>
  import ImageControlPanel from './ImageControlPanel'

  import docker from '../../js/docker'
  import notify from '../../js/notify'

  export default {
    components: {
      ImageControlPanel
    },
    data () {
      return {
        images: [],
        hasFoundImages: false,
        error: '',
        loadingImages: false,
        imagePullModal: false,
        repoTag: ''
      }
    },
    watch: {
      images: function (newImages) {
        this.hasFoundImages = (
          typeof newImages !== 'undefined' &&
          newImages !== null &&
          newImages.length > 0
        )
      }
    },
    methods: {
      refreshImages () {
        this.loadingImages = true
        this.loadImages()
        notify('Image list refreshed!')
        this.loadingImages = false
      },
      pullImage () {
        var self = this
        function imagePulled (info) {
          notify('New image is pulled!')
          self.refreshImages()
        }

        docker.pull(this.repoTag)
          .then(imagePulled)
          .catch(notify)
      },
      inspectImage (imageId) {
        this.$router.push({
          name: 'single-image-view',
          params: { imageId: imageId }
        })
      },
      loadImages () {
        var self = this

        var queries = {
          all: false
        }

        function updateImages (images) {
          self.images = images
          self.error = {}
        }

        function updateErrored (err) {
          self.images = []
          self.error = err
          notify(err)
        }

        docker.listImages(queries)
          .then(updateImages)
          .catch(updateErrored)
      },
      getImageName (repoTag) {
        return repoTag.slice(0, repoTag.indexOf(':'))
      },
      getTags (repoTags) {
        return repoTags.map(function (repoTag) {
          return repoTag.slice(repoTag.indexOf(':') + 1)
        })
      },
      formatBytes (bytes) {
        if (bytes === 0) return '0 Bytes'

        const k = 1000
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        var i = Math.floor(Math.log(bytes) / Math.log(k))

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
      },
      getDateTime (seconds) {
        return new Date(seconds * 1000).toLocaleString()
      }
    },
    created () {
      this.loadImages()
    }
  }
</script>

<style scoped>
  .image-card {
    width: 300px;
    display: inline-block;
    margin: 5px 5px;
  }

  .control-panel {
    display: inline-block;
  }

  .image-card-title {
    height: 26px;
  }
</style>
