<template>
  <div>
    <Button type="success" @click="startContainer">Start</Button>
    <Button type="error" @click="stopContainer">Stop</Button>
    <div v-if="fullPanel" class="additional-buttons">
      <Button type="warning" @click="pauseContainer">Pause</Button>
      <Button type="info" @click="unpauseContainer">Unpause</Button>
      <Button type="warning" @click="restartContainer">Restart</Button>
      <Button type="error" @click="killContainer">Kill</Button>
      <Button type="success" @click="inspectContainer">Refresh</Button>
      <Button type="info" @click="getContainerLogs">Logs</Button>
      <Button type="warning" @click="containerRenameModal = true">Rename</Button>
      <Modal v-model="containerRenameModal" title="Rename Container" @on-ok="renameContainer">
        <Input v-model="containerNewName" placeholder="New Name"></Input>
      </Modal>
      <Button type="error" @click="removeContainerModal = true">Remove</Button>
      <Modal v-model="removeContainerModal" title="Do you want to remove this container?"
          @on-ok="removeContainer">
        Remove the volumes associated with the container:
        <i-switch v-model="rmcParams.v" size="large">
          <span slot="open">True</span>
          <span slot="close">False</span>
        </i-switch>
        <br>
        Force remove:
        <i-switch v-model="rmcParams.force" size="large">
          <span slot="open">True</span>
          <span slot="close">False</span>
        </i-switch>
        <br>
        Remove the specified link associated with the container:
        <i-switch v-model="rmcParams.link" size="large">
          <span slot="open">True</span>
          <span slot="close">False</span>
        </i-switch>
      </Modal>
      <Button type="success" @click="psArgsModal=true">Top</Button>
      <Modal v-model="psArgsModal" title="ps arguments" @on-ok="listTopProcesses">
        <Input class="args-input" v-model="psArgs" placeholder="-ef">
          <span slot="prepend">ps</span>
        </Input>
      </Modal>
      <Modal v-model="topProcessesModal" title="Top Processes">
        <tree-view :data="topResult"></tree-view>
      </Modal>
      <Button type="info" @click="exportContainer">Export</Button>
      <Button type="warning" @click="containerUpdateModal=true">Update</Button>
      <Modal v-model="containerUpdateModal" title="Update Container"
          @on-ok="confirmUpdate" @on-cancel="resetUpdate">
        <container-update-form ref="containerUpdateForm"
          :container-id="containerId" @created="restartContainer">
        </container-update-form>
      </Modal>
    </div>
    <foot-logs-view v-model="footLogs"></foot-logs-view>
  </div>
</template>

<script>
  import TreeView from '../TreeView/TreeView'
  import FootLogsView from '../FootLogsView'
  import ContainerUpdateForm from './ContainerUpdateForm'

  import fs from 'fs'
  import { ipcRenderer } from 'electron'
  import docker from '../../js/docker'
  import notify from '../../js/notify'
  import tarFileSaveInit from '../../js/tarFileSaveInit'
  import { IPC_CHANNEL_OPEN_SAVE_DIALOG } from '../../js/constants/ElectronConstants'
  import {
    STREAM_READABLE_EVENT_END,
    STREAM_READABLE_EVENT_DATA
  } from '../../js/constants/StreamConstants'

  function errorAndRefresh (err) {
    notify(err)
    // bind function to this during usage
    if (this.fullPanel) {
      this.inspectContainer()
    } else {
      this.reload()
    }
  }

  export default {
    components: {
      TreeView,
      FootLogsView,
      ContainerUpdateForm
    },
    props: {
      containerId: {
        type: String,
        default: ''
      },
      containerName: {
        type: String,
        default: ''
      },
      fullPanel: {
        type: Boolean,
        default: false
      },
      // container data
      value: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        topProcessesModal: false,
        containerRenameModal: false,
        logs: '',
        topResult: {},
        containerNewName: '',
        container: {},
        footLogs: {},
        psArgsModal: false,
        psArgs: '',
        removeContainerModal: false,
        rmcParams: {
          v: false,
          force: false,
          link: false
        },
        containerUpdateModal: false
      }
    },
    watch: {
      containerId (newContainerId) {
        this.container = docker.getContainer(newContainerId)
      }
    },
    methods: {
      startContainer () {
        const containerStarted = data => {
          notify(`Container ${this.containerName} started!`)
          if (this.fullPanel) {
            this.inspectContainer()
          } else {
            this.reload()
          }
        }

        this.container.start()
          .then(containerStarted)
          .catch(errorAndRefresh.bind(this))
      },
      stopContainer () {
        const containerStopped = data => {
          notify(`Container ${this.containerName} stopped!`)
          if (this.fullPanel) {
            this.inspectContainer()
          } else {
            this.reload()
          }
        }

        this.container.stop()
          .then(containerStopped)
          .catch(errorAndRefresh.bind(this))
      },
      pauseContainer () {
        const containerPaused = data => {
          notify(`Container ${this.containerName} paused!`)
          this.inspectContainer()
        }

        this.container.pause()
          .then(containerPaused)
          .catch(errorAndRefresh.bind(this))
      },
      unpauseContainer () {
        const containerUnpaused = data => {
          notify(`Container ${this.containerName} unpaused!`)
          this.inspectContainer()
        }

        this.container.unpause()
          .then(containerUnpaused)
          .catch(errorAndRefresh.bind(this))
      },
      restartContainer () {
        const containerRestarted = data => {
          notify(`Container ${this.containerName} restarted!`)
          this.inspectContainer()
        }

        this.container.restart()
          .then(containerRestarted)
          .catch(errorAndRefresh.bind(this))
      },
      killContainer () {
        const containerKilled = data => {
          notify(`Container ${this.containerName} killed!`)
          this.inspectContainer()
        }

        this.container.kill()
          .then(containerKilled)
          .catch(errorAndRefresh.bind(this))
      },
      inspectContainer () {
        var queries = {
          size: true
        }

        const containerRefreshed = data => {
          this.$emit('input', data)
        }

        const refreshErrored = err => {
          this.$emit('input', err)
          notify(err)
        }

        this.container.inspect(queries)
          .then(containerRefreshed)
          .catch(refreshErrored)
      },
      getContainerLogs () {
        // TODO (fluency03) : more options to get the logs
        const logOpts = {
          stdout: true,
          stderr: true,
          tail: 20
        }

        this.$set(this.footLogs, 'runningLog', '')

        const containerLogsGot = data => {
          data.setEncoding('utf8')

          data.on(STREAM_READABLE_EVENT_DATA, logs => {
            this.$set(this.footLogs, 'runningLog', this.footLogs.runningLog + logs)
          })
        }

        this.container.logs(logOpts)
          .then(containerLogsGot)
          .catch(notify)
      },
      exportContainer () {
        var containerName = this.value.Name.replace('/', '')
        var containerId = this.value.Id
        var fileName = `${containerName}_${containerId}.tar`

        ipcRenderer.send(IPC_CHANNEL_OPEN_SAVE_DIALOG, fileName)

        const containerExported = stream => {
          var writeStream = fs.createWriteStream(fileName)

          stream.pipe(writeStream)

          stream.on(STREAM_READABLE_EVENT_END, () => {
            notify(`Container ${containerName}exported to a tar file !`)
          })
        }

        const saveFile = (error, data) => {
          if (!error) {
            fileName = data
            this.container.export()
              .then(containerExported)
              .catch(notify)
          }
        }

        tarFileSaveInit(saveFile)
      },
      renameContainer () {
        if (this.containerNewName === '') {
          notify('Container name cannot be empty!')
          return
        }
        var renameParams = {
          name: this.containerNewName
        }

        const containerRenamed = data => {
          notify(`Rename container to ${renameParams.name} successful!`)
          this.containerNewName = ''
          this.inspectContainer()
        }

        this.container.rename(renameParams)
          .then(containerRenamed)
          .catch(errorAndRefresh.bind(this))
      },
      removeContainer () {
        const containerRemoved = data => {
          notify('Container removed!')
          this.$router.push({
            name: 'containers-view'
          })
        }

        this.container.remove(this.rmcParams)
          .then(containerRemoved)
          .catch(errorAndRefresh.bind(this))
      },
      listTopProcesses () {
        const topParams = {
          ps_args: this.psArgs
        }

        const topProcessesGot = data => {
          this.topResult = data
          this.topProcessesModal = true
          this.psArgs = '-ef'
        }

        this.container.top(topParams)
          .then(topProcessesGot)
          .catch(notify)
      },
      reload () {
        this.$emit('reload')
      },
      confirmUpdate () {
        this.$refs.containerUpdateForm.submit()
      },
      resetUpdate () {
        this.$refs.containerUpdateForm.reset()
      }
    },
    created () {
      this.container = docker.getContainer(this.containerId)
      if (this.fullPanel) {
        this.inspectContainer()
      }
    }
  }
</script>

<style scoped>
  .additional-buttons {
    display: inline-block;
  }

  .args-input {
    width: 30%;
  }
</style>
