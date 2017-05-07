<template>
  <div>
    <Button type="primary" icon="refresh" @click="refreshNetworks">Refresh</Button>
    <br>
    <div v-if="hasFoundNetworks">
      <Card v-for="network in networks" class="network-card">
        <p slot="title" class="network-card-title">
          {{network.Name}}
          <Tag class="network-state-tag">
            {{network.Scope}}
          </Tag>
        </p>
        <p>
          Internal:
          <Tag :color="booleanToTagColor[network.Internal]">{{network.Internal}}</Tag>
          Attachable:
          <Tag :color="booleanToTagColor[network.Attachable]">{{network.Attachable}}</Tag>
        </p>
        <p>Created: {{getDateTime(network.Created)}}</p>
        <Button type="primary" @click="inspectNetwork(network.Id)">Inspect</Button>
        <network-control-panel class="control-panel" :network-id="network.Id"></network-control-panel>
      </Card>
    </div>
    <div v-else>
      <pre>{{error}}</pre>
    </div>
  </div>
</template>

<script>
  import NetworkControlPanel from './NetworkControlPanel'

  import docker from '../../js/docker'
  import notify from '../../js/notify'
  import notNull from '../../js/notNull'

  export default {
    components: {
      NetworkControlPanel
    },
    data () {
      return {
        networks: [],
        hasFoundNetworks: false,
        booleanToTagColor: {
          'true': 'green',
          'false': 'red'
        },
        error: {}
      }
    },
    watch: {
      networks: function (newNetworks) {
        this.hasFoundNetworks = notNull(newNetworks) && newNetworks.length > 0
      }
    },
    methods: {
      refreshNetworks () {
        this.loadNetworks()
        if (notNull(this.error) && this.error !== {}) {
          notify('Refreshed: ' + this.networks.length + ' networks found!')
        }
      },
      inspectNetwork (networkId) {
        this.$router.push({
          name: 'single-network-view',
          params: { networkId: networkId }
        })
      },
      loadNetworks () {
        var self = this

        function updateNetworks (listResults) {
          console.log(listResults)
          self.networks = listResults
          self.error = {}
        }

        function updateErrored (err) {
          self.networks = []
          self.error = err
          notify(err)
        }

        docker.listNetworks()
          .then(updateNetworks)
          .catch(updateErrored)
      },
      getDateTime (isoString) {
        return new Date(isoString).toLocaleString()
      }
    },
    created () {
      this.loadNetworks()
    }
  }
</script>

<style scoped>
  .network-card {
    /*width: 300px;*/
    width: 100%;
    display: inline-block;
    margin: 5px 5px;
  }

  .network-state-tag {
    position: absolute;
    right: 3px;
  }

  .control-panel {
    display: inline-block;
  }


  .network-card {
    width: 300px;
    display: inline-block;
    margin: 5px 5px;
  }

  .network-card-title {
    height: 26px;
  }

  .description-pop p {
    display: block;
    white-space: normal;
    color: #ffffff;
  }

  .description-pop {
    white-space: normal;
  }
</style>
