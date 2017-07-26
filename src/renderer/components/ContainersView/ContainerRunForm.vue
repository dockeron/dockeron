<template>
  <div>
    <Form :label-width="80">
      <Form-item label="Image" required>
        <Input v-model="imageName" placeholder="Image name"></Input>
      </Form-item>
      <Form-item label="CMD">
        <Tag v-for="cmd in cmdToBeExecuted" :key="cmd" :name="cmd" closable @on-close="deleteCMD">
          {{cmd}}
        </Tag>
        <Poptip>
          <Button icon="ios-plus-empty" type="dashed" size="small">Add CMD</Button>
          <div slot="title">What CMD you want to execute?</div>
          <div slot="content">
            <Tooltip content="CMD cannot be empty string!">
              <Input v-model="newCMD" icon="plus-round" @on-click="addCMD" @on-enter="addCMD"
                  placeholder="eg. uname -a">
              </Input>
            </Tooltip>
          </div>
        </Poptip>
      </Form-item>
      <Form-item label="Streams">
        All to <span style="font-family: Courier New;">process.stdout</span>
        <i-switch v-model="splitStreams"></i-switch>
        Split <span style="font-family: Courier New; ">stdout</span> and <span style="font-family: Courier New; ">stderr</span>
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
      value (newValue) {
        this.imageName = newValue
      }
    },
    methods: {
      addCMD () {
        if (!this.newCMD) {
          return
        }
        this.cmdToBeExecuted.push(this.newCMD)
        this.newCMD = ''
      },
      deleteCMD (event, name) {
        var index = this.cmdToBeExecuted.indexOf(name)
        this.cmdToBeExecuted.splice(index, 1)
      },
      submit () {
        var streams = null

        const containerCreated = container => {
          notify('New container ID ' + container.id +
                 ' created from image ' + this.imageName + ' !')
          this.$emit('created', container)
        }

        const containerStarted = container => {
          notify('New container ID ' + container.id + ' started !')
          this.$emit('started', container)
        }

        const creationErrored = err => {
          notify(err)
          this.$emit('failed', err)
        }

        if (this.splitStreams) {
          streams = [process.stdout, process.stderr]
        } else {
          streams = process.stdout
        }

        if (this.newContainerName) {
          this.creationSettings.name = this.newContainerName
        }

        docker.run(this.imageName, this.cmdToBeExecuted, streams, this.creationSettings,
          (err, data, container) => {
            if (err) {
              creationErrored(err)
            }
          })
          .on('container', containerCreated)
          .on('start', containerStarted)

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
        ipcRenderer.send(IPC_CHANNEL_OPEN_FILE_DIALOG)
      }
    },
    created () {
      this.creationSettings = this.importedSettings

      const readFileCB = (err, data) => {
        if (err) {
          notify(err)
        }

        var parsedJSON = JSON.parse(data)
        this.importedSettings = parsedJSON
        this.creationSettings = this.importedSettings
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
