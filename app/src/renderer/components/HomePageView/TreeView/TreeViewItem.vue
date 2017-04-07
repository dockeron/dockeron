<template>
  <div class="tree-view-item">
    <div v-if="isObject(data)" class="tree-view-item-leaf">
      <div class="tree-view-item-node" @click.stop="toggleOpen()" >
        <span :class="{opened: isOpen()}" class="tree-view-item-key tree-view-item-key-with-chevron">
          {{getKey(data)}}
        </span>
        <span class="tree-view-item-hint" v-show="!isOpen() && data.children.length === 1">
          {{data.children.length}} property
        </span>
        <span class="tree-view-item-hint" v-show="!isOpen() && data.children.length !== 1">
          {{data.children.length}} properties</span>
      </div>
      <tree-view-item :key="getKey(data)" :max-depth="maxDepth" :current-depth="currentDepth+1"
          v-show="isOpen()" v-for="child in data.children" :data="child">
      </tree-view-item>
    </div>
    <div v-if="isArray(data)" class="tree-view-item-leaf">
      <div class="tree-view-item-node" @click.stop="toggleOpen()">
        <span :class="{opened: isOpen()}"  class="tree-view-item-key tree-view-item-key-with-chevron">
          {{getKey(data)}}
        </span>
        <span class="tree-view-item-hint" v-show="!isOpen() && data.children.length === 1">
          {{data.children.length}} item
        </span>
        <span class="tree-view-item-hint" v-show="!isOpen() && data.children.length !== 1">
          {{data.children.length}} items
        </span>
      </div>
      <tree-view-item :key="getKey(data)" :max-depth="maxDepth" :current-depth="currentDepth+1"
          v-show="isOpen()" v-for="child in data.children" :data="child">
      </tree-view-item>
    </div>
    <div class="tree-view-item-leaf" v-if="isValue(data)">
      <span class="tree-view-item-key">{{getKey(data)}}</span>
      <span class="tree-view-item-value" :class="getValueType(data)">
        {{getValue(data)}}
      </span>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'tree-view-item',
    props: ['data', 'max-depth', 'current-depth'],
    data: function () {
      return {
        open: this.currentDepth < this.maxDepth
      }
    },
    methods: {
      isOpen: function () {
        return this.open
      },
      toggleOpen: function () {
        this.open = !this.open
      },
      isObject: function (value) {
        return value.type === 'object'
      },
      isArray: function (value) {
        return value.type === 'array'
      },
      isValue: function (value) {
        return value.type === 'value'
      },
      getKey: function (value) {
        if (_.isInteger(value.key)) {
          return value.key + ':'
        } else {
          return '"' + value.key + '":'
        }
      },
      getValue: function (value) {
        if (_.isNumber(value.value)) {
          return value.value
        }
        if (_.isNull(value.value)) {
          return 'null'
        }
        if (_.isString(value.value)) {
          return '"' + value.value + '"'
        }
        return value.value
      },
      getValueType: function (value) {
        var prefix = 'tree-view-item-value-'

        if (_.isNumber(value.value)) {
          return prefix + 'number'
        }
        if (_.isFunction(value.value)) {
          return prefix + 'function'
        }
        if (_.isBoolean(value.value)) {
          return prefix + 'boolean'
        }
        if (_.isNull(value.value)) {
          return prefix + 'null'
        }
        if (_.isString(value.value)) {
          return prefix + 'string'
        }
        return prefix + 'unknown'
      },
      isRootObject: function (value = this.data) {
        return value.isRoot
      }
    }
  }
</script>

<style scoped>
  .tree-view-item {
    font-family: monospace;
    font-size: 14px;
    margin-left: 18px;
  }

  .tree-view-item-node {
    cursor: pointer;
    position: relative;
    white-space: nowrap;
  }

  .tree-view-item-leaf {
    white-space: nowrap;
  }

  .tree-view-item-key {
    font-weight: bold;
  }

  .tree-view-item-key-with-chevron {
    padding-left: 14px;
  }

  .tree-view-item-key-with-chevron.opened::before {
      top:4px;
      transform: rotate(90deg);
      -webkit-transform: rotate(90deg);
  }

  .tree-view-item-key-with-chevron::before {
      color: #444;
      content: '\25b6';
      font-size: 10px;
      left: 1px;
      position: absolute;
      top: 3px;
      transition: -webkit-transform .1s ease;
      transition: transform .1s ease;
      transition: transform .1s ease, -webkit-transform .1s ease;
      -webkit-transition: -webkit-transform .1s ease;
  }

  .tree-view-item-hint {
    color: #ccc
  }
</style>
