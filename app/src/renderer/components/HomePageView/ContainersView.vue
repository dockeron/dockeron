<template>
  <div>
    <Button class="container-operation-button" type="primary" icon="refresh"
        :loading="loadingContainers" @click="refreshContainers">
      <span v-if="!loadingContainers">Refresh</span>
      <span v-else>Loading...</span>
    </Button>
    <Button class="container-operation-button" type="primary" icon="plus-round"
        @click="containerCreateModal = true">
      Create
    </Button>
    <Modal v-model="containerCreateModal" title="Create Container"
        @on-ok="confirmCreation" @on-cancel="resetCreation">
      <container-creation-form ref="containerCreationForm"></container-creation-form>
    </Modal>
    <br>
    <div v-if="hasFoundContainers">
      <Card v-for="container in containers" class="container-card">
        <p slot="title" class="container-card-title">
          {{container.Names[0]}}
          <Tag class="container-state-tag" :color="stateToColor[container.State]">
            {{container.State}}
          </Tag>
        </p>
        <p>Image: {{container.Image}}</p>
        <p>Status: {{container.Status}}</p>
        <Button type="primary" @click="inspectContainer(container.Id)">
          Inspect
        </Button>
        <container-control-panel class="control-panel" :container-id="container.Id"
            @container-data-refreshed="function (newData) { loadContainers() }">
        </container-control-panel>
      </Card>
    </div>
    <div v-else>
      <h4>No containers found.</h4>
      <pre>{{error}}</pre>
    </div>
  </div>
</template>

<script>
  import ContainerControlPanel from './ContainerControlPanel'
  import ContainerCreationForm from './ContainerCreationForm'

  import docker from '../../js/docker'

  export default {
    components: {
      ContainerControlPanel,
      ContainerCreationForm
    },
    data () {
      return {
        containers: [],
        hasFoundContainers: false,
        error: {},
        stateToColor: {
          created: 'blue',
          restarting: 'yellow',
          running: 'green',
          paused: 'yellow',
          exited: 'red',
          dead: 'red'
        },
        loadingContainers: false,
        containerCreateModal: false
      }
    },
    watch: {
      containers: function (newContainers) {
        this.hasFoundContainers = (
          typeof newContainers !== 'undefined' &&
          newContainers !== null &&
          newContainers.length > 0
        )
      }
    },
    methods: {
      confirmCreation () {
        this.$refs.containerCreationForm.submit()
      },
      resetCreation () {
        this.$refs.containerCreationForm.reset()
      },
      refreshContainers () {
        this.loadingContainers = true
        this.loadContainers()
        /* eslint-disable no-new */
        new Notification('Dockeron', {
          body: 'Container List Refreshed!'
        })
        this.loadingContainers = false
      },
      inspectContainer (containerId) {
        console.log('Goto single-container-view: ', containerId)
        this.$router.push({
          name: 'single-container-view',
          params: { containerId: containerId }
        })
      },
      loadContainers () {
        var self = this

        var queries = {
          all: true,
          size: true
        }

        function updateContainers (containers) {
          console.log('listContainers: ', containers)
          self.containers = containers
          self.error = {}
        }

        function updateError (err) {
          console.log('listContainers: ', err)
          self.containers = []
          self.error = err
        }

        docker.listContainers(queries)
          .then(updateContainers)
          .catch(updateError)
      }
    },
    created () {
      this.loadContainers()
    }
  }
</script>

<style scoped>
  .container-card {
    width: 300px;
    display: inline-block;
    margin: 5px 5px;
  }

  .container-card-title {
    height: 26px;
  }

  .control-panel {
    display: inline-block;
  }

  .container-state-tag {
    position: absolute;
    right: 3px;
  }
</style>
