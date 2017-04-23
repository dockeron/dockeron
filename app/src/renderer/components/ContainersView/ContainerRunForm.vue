<template>
  <div>
    <Form :label-width="80">
      <Form-item label="Image" required>
        <Input v-model="imageName" placeholder="Image name"></Input>
      </Form-item>
      <Form-item label="CMD">
        <Tag v-for="cmd in cmdToBeExecuted" :key="cmd" :name="cmd" closable@on-close="deleteCMD">
          {{cmd}}
        </Tag>
        <Poptip>
          <Button icon="ios-plus-empty" type="dashed" size="small">Add CMD</Button>
          <div slot="title">What CMD you want to execute?</div>
          <div slot="content">
            <Input v-model="newCMD" icon="plus-round" @on-click="addCMD" @on-enter="addCMD"
                placeholder="eg. /bin/bash">
            </Input>
          </div>
        </Poptip>
      </Form-item>
      <Form-item label="Streams">
        All to process.stdout
        <i-switch v-model="splitStreams"></i-switch>
        Split process.stdout and process.stderr
      </Form-item>
      <Form-item label="Name">
        <Input v-model="newContainerName" placeholder="New name of your container"></Input>
      </Form-item>
    </Form>
    <Button class="import-button" type="primary" @click="openFileDialog">
      Import from JSON
    </Button>
    <json-form class="advanced-settings-form" name="Container Creation Settings" :label-width="80"
        v-model="creationSettings">
    </json-form>
  </div>
</template>

<script>
  import JsonForm from '../JsonForm/JsonForm'

  import fs from 'fs'
  import path from 'path'
  import { ipcRenderer } from 'electron'
  import docker from '../../js/docker'
  import notify from '../../js/notify'

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
        imageName: this.value,
        cmdToBeExecuted: [],
        newCMD: '',
        splitStreams: false,
        newContainerName: '',
        importedSettings: {
          'Hostname': '',
          'User': '',
          'AttachStdin': false,
          'AttachStdout': true,
          'AttachStderr': true,
          'Tty': true,
          'OpenStdin': false,
          'StdinOnce': false,
          'Env': null,
          'Volumes': {},
          'VolumesFrom': []
        },
        creationSettings: {}
      }
    },
    watch: {
      value: function (newValue) {
        this.imageName = newValue
      }
    },
    methods: {
      addCMD () {
        this.cmdToBeExecuted.push(this.newCMD)
        this.newCMDs = ''
      },
      deleteCMD (event, name) {
        var index = this.cmdToBeExecuted.indexOf(name)
        this.cmdToBeExecuted.splice(index, 1)
      },
      submit () {
        var self = this
        var streams = null

        function containerCreated (container) {
          notify('New container ID ' + container.Id +
                 ' created from image ' + self.defaultSettings.Image + ' !')
          self.$emit('new-container-created', container)
        }

        function creationErrored (err) {
          notify(err)
          self.$emit('no-container-created', err)
        }

        if (this.splitStreams) {
          streams = [process.stdout, process.stderr]
        } else {
          streams = process.stdout
        }

        docker.run(this.imageName, this.cmdToBeExecuted, streams, this.creationSettings)
          .then(containerCreated)
          .catch(creationErrored)

        this.reset()
      },
      reset () {
        this.imageName = this.value
        this.cmdToBeExecuted = []
        this.newCMD = ''
        this.splitStreams = false
        this.newContainerName = ''
        this.creationSettings = {
          'Hostname': '',
          'User': '',
          'AttachStdin': false,
          'AttachStdout': true,
          'AttachStderr': true,
          'Tty': true,
          'OpenStdin': false,
          'StdinOnce': false,
          'Env': null,
          'Volumes': {},
          'VolumesFrom': []
        }
      },
      openFileDialog () {
        ipcRenderer.send('open-file-dialog')
      }
    },
    created () {
      var self = this
      this.creationSettings = this.importedSettings

      ipcRenderer.on('selected-directory', function (event, filepaths) {
        // console.log(filepaths)
        if (filepaths.length === 1) {
          notify('You should select and ONLY SELECT ONE file!')
          return
        }

        var filepath = filepaths[0]
        try {
          if (path.extname(filepath) === '.json') {
            notify('Not a .json file!')
            return
          }

          fs.readFile(filepath, (err, data) => {
            if (err) {
              notify(err)
            }
            var parsedJSON = JSON.parse(data)
            self.importedSettings = parsedJSON
            self.creationSettings = self.importedSettings
          })
        } catch (e) {
          notify(e)
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
