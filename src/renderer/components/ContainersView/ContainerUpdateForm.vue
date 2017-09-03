<template>
  <div>
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
        type: String
      },
      containerId: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        importedSettings: {},
        advancedSettings: {}
      }
    },
    methods: {
      submit () {
        const containerUpdated = container => {
          notify(`Container updated!`)
          this.$emit('updated', container)
        }

        const creationErrored = err => {
          notify(err)
          this.$emit('failed', err)
        }

        this.container.update(this.advancedSettings)
          .then(containerUpdated)
          .catch(creationErrored)

        this.reset()
      },
      reset () {
        this.advancedSettings = this.importedSettings
      },
      openFileDialog () {
        ipcRenderer.send(IPC_CHANNEL_OPEN_FILE_DIALOG)
      }
    },
    created () {
      this.container = docker.getContainer(this.containerId)
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
