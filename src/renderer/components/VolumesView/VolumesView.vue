<template>
  <div>
    <Button type="primary" icon="refresh" @click="refreshVolumes">Refresh</Button>
    <br>
    <div v-if="hasFoundVolumes">
      <Card v-for="volume in volumes" :key="volume.Name" class="volume-card">
        <Poptip trigger="hover">
            {{volume.Name}}
          <div slot="content">
            <Button type="primary" @click="inspectVolume(volume.Name)">Inspect</Button>
            <volume-control-panel class="control-panel" :volume-name="volume.Name"
                @removed="loadVolumes">
            </volume-control-panel>
          </div>
        </Poptip>
        <Tag class="volume-state-tag">{{volume.Driver}}</Tag>
      </Card>
    </div>
    <div v-else>
      <pre>{{error}}</pre>
    </div>
  </div>
</template>

<script>
  import VolumeControlPanel from './VolumeControlPanel'

  import docker from '../../js/docker'
  import notify from '../../js/notify'
  import notNull from '../../js/notNull'
  import formatBytes from '../../js/formatBytes'
  import { SINGLE_VOLUME_VIEW_NAME } from '../../js/constants/RouteConstants'

  export default {
    components: {
      VolumeControlPanel
    },
    data () {
      return {
        volumes: [],
        hasFoundVolumes: false,
        error: {}
      }
    },
    watch: {
      volumes (newVolumes) {
        this.hasFoundVolumes = notNull(newVolumes) && newVolumes.length > 0
      }
    },
    methods: {
      refreshVolumes () {
        this.loadVolumes()
        if (notNull(this.error) && this.error !== {}) {
          notify('Refreshed: ' + this.volumes.length + ' volumes found!')
        }
      },
      inspectVolume (volumeName) {
        this.$router.push({
          name: SINGLE_VOLUME_VIEW_NAME,
          params: { volumeName }
        })
      },
      loadVolumes () {
        const updateVolumes = listResults => {
          this.volumes = listResults.Volumes
          this.error = {}
        }

        const updateErrored = err => {
          this.volumes = []
          this.error = err
          notify(err)
        }

        docker.listVolumes()
          .then(updateVolumes)
          .catch(updateErrored)
      },
      formatBytes
    },
    created () {
      this.loadVolumes()
    }
  }
</script>

<style scoped>
  .volume-card {
    /*width: 300px;*/
    width: 100%;
    display: inline-block;
    margin: 5px 5px;
  }

  .volume-state-tag {
    position: absolute;
    right: 3px;
  }

  .control-panel {
    display: inline-block;
  }
</style>
