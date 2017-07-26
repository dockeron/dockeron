<template>
  <div>
    <Button type="primary" icon="refresh" @click="refreshContainers">Refresh</Button>
    <Button type="primary" icon="plus-round" @click="containerCreateModal = true">Create</Button>
    <Modal v-model="containerCreateModal" title="Create Container"
        @on-ok="confirmCreation" @on-cancel="resetCreation">
      <container-creation-form ref="containerCreationForm" @created="loadContainers">
      </container-creation-form>
    </Modal>
    <Button type="primary" icon="code" @click="containerRunModal = true">Run</Button>
    <Modal v-model="containerRunModal" title="Run" @on-ok="confirmRun" @on-cancel="resetRun">
      <container-run-form ref="containerRunForm" @created="loadContainers" @started="loadContainers">
      </container-run-form>
    </Modal>
    <Button type="primary" icon="navicon-round" @click="listParamsModal = true">Filters</Button>
    <Modal v-model="listParamsModal" title="Filters for listing containers">
      <!-- TODO (fluency03): list containers filters -->
      TODO
    </Modal>
    <br>
    <div v-if="hasFoundContainers">
      <Card v-for="container in containers" :key="container.Id" class="container-card">
        <p slot="title" class="container-card-title">
          {{container.Names[0]}}
          <Tag class="container-state-tag" :color="stateToColor[container.State]">
            {{container.State}}
          </Tag>
        </p>
        <p>
          Image: {{getImageName(container.Image)}}
          <Tag v-if="getTag(container.Image)">{{getTag(container.Image)}}</Tag>
        </p>
        <p>Size: rw {{formatBytes(container.SizeRw)}}, rootfs {{formatBytes(container.SizeRootFs)}}</p>
        <p>Status: {{container.Status}}</p>
        <Button type="primary" @click="inspectContainer(container.Id)">Inspect</Button>
        <container-control-panel class="control-panel"
            :container-id="container.Id" :container-name="container.Names[0]"
            @reload="loadContainers">
        </container-control-panel>
      </Card>
    </div>
    <div v-else>
      <pre>{{error}}</pre>
    </div>
  </div>
</template>

<script>
  import ContainerControlPanel from './ContainerControlPanel'
  import ContainerCreationForm from './ContainerCreationForm'
  import ContainerRunForm from './ContainerRunForm'

  import docker from '../../js/docker'
  import notify from '../../js/notify'
  import notNull from '../../js/notNull'
  import parseRepoTag from '../../js/parseRepoTag'
  import formatBytes from '../../js/formatBytes'
  import containerStateToColor from '../../js/containerStateToColor'
  import { SINGLE_CONTAINER_VIEW_NAME } from '../../js/constants/RouteConstants'

  export default {
    components: {
      ContainerControlPanel,
      ContainerCreationForm,
      ContainerRunForm
    },
    data () {
      return {
        containers: [],
        hasFoundContainers: false,
        error: {},
        stateToColor: containerStateToColor,
        containerCreateModal: false,
        containerRunModal: false,
        listParamsModal: false
      }
    },
    watch: {
      containers (newContainers) {
        this.hasFoundContainers = (
        notNull(newContainers) &&
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
      confirmRun () {
        this.$refs.containerRunForm.submit()
      },
      resetRun () {
        this.$refs.containerRunForm.reset()
      },
      refreshContainers () {
        this.loadContainers()
        if (notNull(this.error) && this.error !== {}) {
          notify('Refreshed: ' + this.containers.length + ' containers found!')
        }
      },
      getImageName (repoTag) {
        return parseRepoTag(repoTag).repository
      },
      getTag (repoTag) {
        return parseRepoTag(repoTag).tag
      },
      inspectContainer (containerId) {
        this.$router.push({
          name: SINGLE_CONTAINER_VIEW_NAME,
          params: { containerId }
        })
      },
      loadContainers () {
        var queries = {
          all: true,
          size: true
        }

        const updateContainers = containers => {
          this.containers = containers
          this.error = {}
        }

        const updateErrored = err => {
          this.containers = []
          this.error = err
          notify(err)
        }

        docker.listContainers(queries)
          .then(updateContainers)
          .catch(updateErrored)
      },
      formatBytes
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
