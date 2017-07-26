<template>
  <div>
    <Button type="success" @click="selectTag">Create</Button>
    <Modal v-model="imageSelectionModal" title="Select Image Name and Tag"
        @on-ok="containerCreateModal = true">
      <Select v-model="selectedImage" style="width:400px">
        <Option v-for="repoTag in imageRepoTags" :value="repoTag" :key="repoTag">
          {{ repoTag }}
        </Option>
      </Select>
    </Modal>
    <Modal v-model="containerCreateModal" title="Create Container"
        @on-ok="confirmCreation" @on-cancel="resetCreation">
      <container-creation-form ref="containerCreationForm" v-model="selectedImage">
      </container-creation-form>
    </Modal>
    <Button type="error" @click="removeImageModal = true">Remove</Button>
    <Modal v-model="removeImageModal" title="Do you want to remove this image?"
        @on-ok="removeImage">
      Force remove:
      <i-switch v-model="rmiParams.force" size="large">
        <span slot="open">True</span>
        <span slot="close">False</span>
      </i-switch>
      <br>
      Do not delete untagged parent images:
      <i-switch v-model="rmiParams.noprune" size="large">
        <span slot="open">True</span>
        <span slot="close">False</span>
      </i-switch>
    </Modal>
    <Modal v-model="removedImageModal" title="Remove results">
      <tree-view :data="removed"></tree-view>
    </Modal>
    <div v-if="fullPanel" class="additional-buttons">
      <Button type="success" @click="getImageHistory">History</Button>
      <Modal v-model="imageHistoryModal" title="Image History">
        <tree-view :data="history"></tree-view>
      </Modal>
      <Button type="warning" @click="pushImage">Push</Button>
      <Button type="info" @click="tagImageModal = true">Tag/Rename</Button>
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
      <Button type="success" @click="getImage">Get</Button>
    </div>
  </div>
</template>

<script>
  import ContainerCreationForm from '../ContainersView/ContainerCreationForm'
  import TreeView from '../TreeView/TreeView'

  import fs from 'fs'
  import docker from '../../js/docker'
  import notify from '../../js/notify'
  import { STREAM_READABLE_EVENT_END } from '../../js/constants/StreamConstants'

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
      fullPanel: {
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
        imageRepoTags: [],
        rmiParams: {
          force: false,
          noprune: false
        }
      }
    },
    watch: {
      imageId (newImageId) {
        this.image = docker.getImage(newImageId)
      },
      imageRepoTags (newRepoTags) {
        this.selectedImage = newRepoTags[0]
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
        const imageRemoved = removed => {
          this.removed = removed
          this.removedImageModal = true
          notify('Image has been removed!')
          this.$emit('removed')
        }

        this.image.remove(this.rmiParams)
          .then(imageRemoved)
          .catch(notify)
      },
      getImageHistory () {
        const imageHistoryGot = history => {
          this.history = history
          this.imageHistoryModal = true
        }

        this.image.history()
          .then(imageHistoryGot)
          .catch(notify)
      },
      pushImage () {
        // TODO (fluency03)
      },
      tagImage () {
        const imageTagged = info => {
          this.inspectImage()
        }

        this.image.tag(this.newTags)
          .then(imageTagged)
          .catch(notify)
      },
      getImage () {
        // TODO (fluency03): collaborate with openSaveDialog
        const imagesGot = stream => {
          var imageId = this.value.Id.replace('sha256:', '')
          var fileName = `${imageId}.tar`
          var writeStream = fs.createWriteStream(fileName)

          stream.pipe(writeStream)

          stream.on(STREAM_READABLE_EVENT_END, () => {
            notify(`Image ${imageId}exported to a tar file !`)
          })
        }

        this.image.get()
          .then(imagesGot)
          .catch(notify)
      },
      inspectImage () {
        const imageRefreshed = data => {
          this.imageRepoTags = data.RepoTags
          this.$emit('input', data)
        }

        const refreshErrored = err => {
          this.imageRepoTags = []
          this.$emit('input', err)
          notify(err)
        }

        this.image.inspect()
          .then(imageRefreshed)
          .catch(refreshErrored)
      }
    },
    created () {
      this.image = docker.getImage(this.imageId)
      if (this.fullPanel) {
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
