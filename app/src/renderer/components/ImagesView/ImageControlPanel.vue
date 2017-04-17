<template>
  <div>
    <Button type="success" @click="selectTag">
      Create
    </Button>
    <Modal v-model="imageSelectionModal" title="Select Image Name and Tag"
        @on-ok="containerCreateModal = true">
      <Select v-model="selectedImage" style="width:400px">
        <Option v-for="repoTag in imageRepoTags" :value="repoTag" :key="repoTag">{{ repoTag }}</Option>
      </Select>
    </Modal>
    <Modal v-model="containerCreateModal" title="Create Container"
        @on-ok="confirmCreation" @on-cancel="resetCreation">
      <container-creation-form ref="containerCreationForm" v-model="selectedImage">
      </container-creation-form>
    </Modal>
    <Button type="error" @click="removeImageModal = true">
      Remove
    </Button>
    <Modal v-model="removeImageModal" title="Do you want to remove this image?"
        @on-ok="removeImage">
    </Modal>
    <Modal v-model="removedImageModal" title="Remove results">
      <tree-view :data="removed"></tree-view>
    </Modal>
    <div v-if="hasAllButtons" class="additional-buttons">
      <Button type="success" @click="getImageHistory">
        History
      </Button>
      <Modal v-model="imageHistoryModal" title="Image History">
        <tree-view :data="history"></tree-view>
      </Modal>
      <Button type="warning" @click="pushImage">
        Push
      </Button>
      <Button type="info" @click="tagImageModal = true">
        Tag/Rename
      </Button>
      <Modal v-model="tagImageModal" title="Tag Image" @on-ok="tagImage">
        <Form :model="newTags" label-position="right" :label-width="70">
          <Form-item prop="repo" label="Repository">
            <Input v-model="newTags.repo" placeholder="The repository to tag in."></Input>
          </Form-item>
          <Form-item prop="tag" label="Tag">
            <Input v-model="newTags.tag" placeholder="The name of the new tag."></Input>
          </Form-item>
        </Form>
      </Modal>
      <Button type="success" @click="getImage">
        Get
      </Button>
    </div>
  </div>
</template>

<script>
  import ContainerCreationForm from '../ContainersView/ContainerCreationForm'
  import TreeView from '../TreeView/TreeView'

  import docker from '../../js/docker'
  import notify from '../../js/notify'

  export default {
    components: {
      ContainerCreationForm,
      TreeView
    },
    props: {
      imageId: {
        type: String,
        default: ''
      },
      initialize: {
        type: Boolean,
        default: false
      },
      hasAllButtons: {
        type: Boolean,
        default: false
      },
      // image data
      value: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        imageSelectionModal: false,
        containerCreateModal: false,
        removeImageModal: false,
        removedImageModal: false,
        imageHistoryModal: false,
        tagImageModal: false,
        history: {},
        removed: {},
        newTags: {
          repo: '',
          tag: ''
        },
        image: {},
        selectedImage: '',
        imageRepoTags: []
      }
    },
    watch: {
      imageRepoTags: function (newRepoTags) {
        try {
          this.selectedImage = newRepoTags[0]
        } catch (e) {
          console.log(e)
        }
      }
    },
    methods: {
      selectTag () {
        this.inspectImage()
        this.imageSelectionModal = true
      },
      confirmCreation () {
        this.$refs.containerCreationForm.submit()
      },
      resetCreation () {
        this.$refs.containerCreationForm.reset()
      },
      removeImage () {
        var self = this

        function imageRemoved (removed) {
          self.removed = removed
          self.removedImageModal = true
          notify('Image has been removed!')
          self.$emit('image-removed', removed)
        }

        this.image.remove()
          .then(imageRemoved)
          .catch(notify)
      },
      getImageHistory () {
        var self = this

        function imageHistoryGot (history) {
          self.history = history
          self.imageHistoryModal = true
        }

        this.image.history()
          .then(imageHistoryGot)
          .catch(notify)
      },
      pushImage () {
        // TODO (fluency03)
      },
      tagImage () {
        var self = this

        function imageTagged (info) {
          self.inspectImage()
        }

        this.image.tag(this.newTags)
          .then(imageTagged)
          .catch(notify)
      },
      getImage () {
        // TODO (fluency03)
      },
      inspectImage () {
        var self = this

        function imageRefreshed (data) {
          self.imageRepoTags = data.RepoTags
          self.$emit('input', data)
        }

        function refreshErrored (err) {
          self.imageRepoTags = []
          self.$emit('input', err)
          notify(err)
        }

        this.image.inspect()
          .then(imageRefreshed)
          .catch(refreshErrored)
      }
    },
    created () {
      this.image = docker.getImage(this.imageId)
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
