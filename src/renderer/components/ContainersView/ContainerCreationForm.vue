<template>
  <div>
    <Form :model="defaultSettings" :label-width="80">
      <Form-item label="Image" required>
        <Input v-model="defaultSettings.Image" placeholder="Image Name"></Input>
      </Form-item>
      <Form-item label="Name">
        <Input v-model="defaultSettings.name" placeholder="New name of your container"></Input>
      </Form-item>
    </Form>
    <Button class="import-button" type="primary" @click="openFileDialog">
      Import from JSON
    </Button>
    <json-form class="advanced-settings-form" name="Advanced Settings" :label-width="80"
        v-model="advancedSettings">
    </json-form>
  </div>
</template>

<script>
  import JsonForm from '../JsonForm/JsonForm'

  import { ipcRenderer } from 'electron'
  import docker from '../../js/docker'
  import notify from '../../js/notify'
  import jsonFileImportInit from '../../js/jsonFileImportInit'
  import { IPC_CHANNEL_OPEN_FILE_DIALOG } from '../../js/constants/ElectronConstants'

  export default {
    components: {
      JsonForm
    },
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        defaultSettings: {
          Image: this.value,
          name: ''
        },
        importedSettings: {},
        advancedSettings: {}
      }
    },
    watch: {
      value: function (newValue) {
        this.defaultSettings.Image = newValue
      }
    },
    methods: {
      submit () {
        const containerCreated = container => {
          notify('New container ID ' + container.id +
                 ' created from image ' + this.defaultSettings.Image + ' !')
          this.$emit('created', container)
        }

        const creationErrored = err => {
          notify(err)
          this.$emit('failed', err)
        }

        docker.createContainer(Object.assign({}, this.defaultSettings, this.advancedSettings))
          .then(containerCreated)
          .catch(creationErrored)

        this.reset()
      },
      reset () {
        this.defaultSettings = {
          Image: '',
          name: ''
        }
        this.advancedSettings = this.importedSettings
      },
      openFileDialog () {
        ipcRenderer.send(IPC_CHANNEL_OPEN_FILE_DIALOG)
      }
    },
    created () {
      this.stringifiedSettings = JSON.stringify(this.importedSettings, null, 4)

      const readFileCB = (err, data) => {
        if (err) {
          notify(err)
        }

        var parsedJSON = JSON.parse(data)
        this.importedSettings = parsedJSON
        this.advancedSettings = this.importedSettings
      }

      jsonFileImportInit(readFileCB)
    }
  }
</script>

<style scoped>
  .switch {
    display: inline-block;
  }
  .import-button {
    display: inline-block;
  }
  .advanced-settings-form {
    margin-top: 10px;
  }
</style>
