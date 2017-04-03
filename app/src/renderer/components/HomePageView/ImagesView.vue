<template>
  <div>
    <Button class="refresh-button" type="primary" icon="refresh"
        :loading="loadingImages" @click="refreshImages">
      <span v-if="!loadingImages">Refresh</span>
      <span v-else>Loading...</span>
    </Button>
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
      </Card>
    </div>
    <div v-else>
      <h4>No images found.</h4
      <pre>{{error}}</pre>
    </div>
  </div>
</template>

<script>
  import docker from '../../js/docker'

  export default {
    data () {
      return {
        images: [],
        hasFoundImages: false,
        error: '',
        loadingImages: false
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
        /* eslint-disable no-new */
        new Notification('Dockeron', {
          body: 'Image List Refreshed!'
        })
        this.loadingImages = false
      },
      inspectImage (imageId) {
        console.log('Goto single-image-view: ', imageId)
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
          console.log('listImages: ', images)
          self.images = images
          self.error = {}
        }

        function updateError (err) {
          console.log('listImages: ', err)
          self.images = []
          self.error = err
        }

        docker.listImages(queries)
          .then(updateImages)
          .catch(updateError)
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

  .image-card-title {
    height: 26px;
  }

  .refresh-button {
    display: block;
  }
</style>
