<template>
  <div>
    <Button class="container-control-button" type="error" @click="removeImageModal = true">
      Remove
    </Button>
    <Modal v-model="removeImageModal" title="Do you want to remove this image?"
        @on-ok="removeImage">
    </Modal>
    <Modal v-model="removedImageModal" title="Remove results"
        @on-ok="goBackHome">
      <tree-view class="tree-view" :data="removed" :options="{maxDepth: 2}">
      </tree-view>
    </Modal>
    <Button class="container-control-button" type="success" @click="getImageHistory">
      History
    </Button>
    <Modal v-model="imageHistoryModal" title="Image History">
      <tree-view class="tree-view" :data="history" :options="{maxDepth: 2}">
      </tree-view>
    </Modal>
    <div v-if="hasAllButtons" class="additional-buttons">
      <Button class="container-control-button" type="warning" @click="pushImage">
        Push
      </Button>
      <Button class="container-control-button" type="info" @click="tagImageModal = true">
        Tag
      </Button>
      <Modal v-model="tagImageModal" title="Tag Image" @on-ok="tagImage">
        Repo: <Input v-model="newTags.repo" placeholder="The repository to tag in."></Input>
        Tag: <Input v-model="newTags.tag" placeholder="The name of the new tag."></Input>
      </Modal>
      <!-- <Button class="container-control-button" type="success" @click="getImage">
        Get
      </Button> -->
    </div>
  </div>
</template>

<script>
  import docker from '../../js/docker'
  import TreeView from './TreeView/TreeView'

  export default {
    components: {
      TreeView
    },
    data () {
      return {
        removeImageModal: false,
        removedImageModal: false,
        imageHistoryModal: false,
        tagImageModal: false,
        history: {},
        removed: {},
        newTags: {
          repo: '',
          tag: ''
        }
      }
    },
    props: {
      imageId: String,
      initialize: {
        type: Boolean,
        default: false
      },
      hasAllButtons: false
    },
    methods: {
      removeImage () {
        var self = this
        var image = docker.getImage(self.imageId)

        image.remove()
          .then(function (removed) {
            self.removed = removed
            self.removedImageModal = true
            /* eslint-disable no-new */
            new Notification('Dockeron', {
              body: 'Image has been removed!'
            })
            self.$emit('image-removed', removed)
          })
          .catch(console.warn)
      },
      goBackHome () {
        //
      },
      getImageHistory () {
        var self = this
        var image = docker.getImage(self.imageId)

        image.history()
          .then(function (history) {
            self.history = history
            self.imageHistoryModal = true
          })
          .catch(console.warn)
      },
      pushImage () {
        var self = this
        var image = docker.getImage(self.imageId)

        console.log(image)
        //
      },
      tagImage () {
        var self = this
        var image = docker.getImage(self.imageId)

        image.tag(this.newTags)
          .then(function (info) {
            console.log(info)
            self.inspectImage()
          })
          .catch(console.warn)
      },
      getImage () {
        var self = this
        var image = docker.getImage(self.imageId)

        console.log(image)
        //
      },
      inspectImage () {
        var self = this
        var image = docker.getImage(self.imageId)

        function imageRefreshed (data) {
          console.log('inspect: ', data)
          self.$emit('image-data-refreshed', data)
        }

        function imageErrored (err) {
          console.log('inspect: ', err)
          self.$emit('image-data-errored', err)
        }

        image.inspect()
          .then(imageRefreshed)
          .catch(imageErrored)
      }
    },
    created () {
      if (this.initialize) {
        this.inspectImage()
      }
    }
  }
</script>

<style scoped>
  .additional-buttons {
    display: inline-block;
  }
</style>
