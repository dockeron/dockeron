<template>
  <div>
    <Button type="primary" icon="refresh" @click="refreshContainers">
      Refresh
    </Button>
    <Button type="primary" icon="plus-round" @click="containerCreateModal = true">
      Create
    </Button>
    <Modal v-model="containerCreateModal" title="Create Container"
        @on-ok="confirmCreation" @on-cancel="resetCreation">
      <container-creation-form ref="containerCreationForm"
          @new-container-created="function (newContainer) { loadContainers() }">
      </container-creation-form>
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
        <container-control-panel class="control-panel"
            :container-id="container.Id" :container-name="container.Names[0]"
            @input="function (newData) { loadContainers() }">
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
  import notify from '../../js/notify'

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
        this.loadContainers()
        notify('Container list refreshed!')
      },
      inspectContainer (containerId) {
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
          self.containers = containers
          self.error = {}
        }

        function updateErrored (err) {
          self.containers = []
          self.error = err
          notify(err)
        }

        docker.listContainers(queries)
          .then(updateContainers)
          .catch(updateErrored)
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

  .container-state-tag {
    position: absolute;
    right: 3px;
  }

  .control-panel {
    display: inline-block;
  }
</style>
