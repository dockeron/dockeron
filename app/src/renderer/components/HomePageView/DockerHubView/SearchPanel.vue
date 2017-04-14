<template>
  <Poptip placement="bottom">
    Search:
    <Input class="search-input" icon="ios-search" v-model="term" @on-click="search"></Input>
    <div slot="content">
      Limit:
      <Input-number v-model="limit"></Input-number>
      <Checkbox-group class="filter-option" v-model="selectedFilters">
        <Checkbox label="is-automated">Automated</Checkbox>
        <Checkbox label="is-official">Official</Checkbox>
        <Checkbox label="stars">Stars</Checkbox>
      </Checkbox-group>
      <p class="filter-option">
        Automated:
        <i-switch v-model="filters['is-automated']" size="large">
          <span slot="open">true</span>
          <span slot="close">false</span>
        </i-switch>
      </p>
      <p class="filter-option">
        Official:
        <i-switch v-model="filters['is-official']" size="large">
          <span slot="open">true</span>
          <span slot="close">false</span>
        </i-switch>
      </p>
      <p class="filter-option">
        Stars:
        <Input-number v-model="filters['stars']"></Input-number>
      </p>
    </div>
  </Poptip>
</template>

<script>
  import docker from '../../../js/docker'
  import notify from '../../../js/notify'

  export default {
    props: {
      // searched images
      value: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        term: '',
        limit: 15,
        selectedFilters: [],
        filters: {
          'is-automated': true,
          'is-official': true,
          'stars': 0
        }
      }
    },
    methods: {
      search () {
        var self = this

        var searchParams = {
          term: this.term,
          limit: this.limit
        }

        var searchFilters = {}
        this.selectedFilters.forEach(function (filter) {
          searchFilters[filter] = [self.filters[filter].toString()]
        })
        searchParams['filters'] = JSON.stringify(searchFilters)

        function imagesSearched (images) {
          self.$emit('input', images)
          notify(images.length + ' images found!')
        }

        docker.searchImages(searchParams)
          .then(imagesSearched)
          .catch(notify)
      }
    }
  }
</script>

<style scoped>
  .search-input {
    width: 190px;
    margin-right: 8px;
  }

  .filter-option {
    margin-top: 10px;
  }
</style>
