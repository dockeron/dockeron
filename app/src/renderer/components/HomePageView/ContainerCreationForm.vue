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
    <!-- Advanced Settings: -->
    <Button class="import-button" type="primary" @click="openFileDialog">
      Import from JSON
    </Button>
    <json-form class="advanced-settings-form" name="Advanced Settings" :label-width="80"
        v-model="advancedSettings">
    </json-form>
  </div>
</template>

<script>
  // import JsonForm from 'vue-json-form'
  import JsonForm from './JsonForm/JsonForm'
  import docker from '../../js/docker'
  import { ipcRenderer } from 'electron'
  import fs from 'fs'
  import path from 'path'

  export default {
    components: {
      JsonForm
    },
    data () {
      return {
        defaultSettings: {
          Image: '',
          name: ''
        },
        importedSettings: {},
        advancedSettings: {},
        errorred: false
      }
    },
    methods: {
      submit () {
        var self = this
        console.log('submit: ', this.defaultSettings)
        console.log('submit: ', this.advancedSettings)

        function newContainerCreated (container) {
          console.log(container)
          /* eslint-disable no-new */
          new Notification('Dockeron', {
            body: 'New Container Created!'
          })
          self.$emit('new-container-created', container)
        }

        function noContainerCreated (err) {
          console.log(err)
          /* eslint-disable no-new */
          new Notification('Dockeron', {
            body: err
          })
          self.$emit('no-container-created', err)
        }

        docker.createContainer(Object.assign(this.defaultSettings, this.advancedSettings))
          .then(newContainerCreated)
          .catch(noContainerCreated)

        this.reset()
      },
      reset () {
        console.log('reset')
        this.defaultSettings = {
          Image: '',
          name: ''
        }
        this.advancedSettings = this.importedSettings
      },
      openFileDialog () {
        ipcRenderer.send('open-file-dialog')
      }
    },
    created () {
      var self = this
      this.stringifiedSettings = JSON.stringify(this.importedSettings, null, 4)
      ipcRenderer.on('selected-directory', function (event, filepaths) {
        // console.log(filepaths)
        if (filepaths.length === 1) {
          var filepath = filepaths[0]
          console.log(filepath)
          try {
            if (path.extname(filepath) === '.json') {
              fs.readFile(filepath, (err, data) => {
                if (err) {
                  /* eslint-disable no-new */
                  new Notification('Dockeron', {
                    body: err
                  })
                }
                var parsedJSON = JSON.parse(data)
                console.log(parsedJSON)
                self.importedSettings = parsedJSON
                self.advancedSettings = self.importedSettings
              })
            } else {
              /* eslint-disable no-new */
              new Notification('Dockeron', {
                body: 'Not a .json file!'
              })
            }
          } catch (e) {
            /* eslint-disable no-new */
            new Notification('Dockeron', {
              body: e
            })
          }
        } else {
          /* eslint-disable no-new */
          new Notification('Dockeron', {
            body: 'You should select and ONLY SELECT ONE file!'
          })
        }
      })
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
