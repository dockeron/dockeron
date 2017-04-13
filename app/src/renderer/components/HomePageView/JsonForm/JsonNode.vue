<template>
  <div>
    <div v-if="isArray(value)">
      <Collapse>
        <Panel>
          {{prop}}
          <p slot="content">
            <template v-for="(item, index) in value">
              <json-node :prop="index.toString()" v-model="value[index]"></json-node>
            </template>
            <add-new-node :is-array="true" @add-new-node="add"></add-new-node>
          </p>
        </Panel>
      </Collapse>
    </div>
    <div v-else-if="isString(value)">
      <Form-item :label="prop">
        <Input v-model="value" :placeholder="value"></Input>
      </Form-item>
    </div>
    <div v-else-if="isBoolean(value)">
      <Form-item :label="prop" class="switch">
        <i-switch v-model="value" size="large">
          <span slot="open">true</span>
          <span slot="close">false</span>
        </i-switch>
      </Form-item>
    </div>
    <div v-else-if="isNumber(value)">
      <Form-item :label="prop" class="switch">
        <Input-number v-model="value"></Input-number>
      </Form-item>
    </div>
    <div v-else-if="isObject(value)">
      <Collapse>
        <Panel>
          {{prop}}
          <p slot="content">
            <template v-for="(subvalue, subprop) in value">
              <json-node :prop="subprop" v-model="value[subprop]"></json-node>
            </template>
            <add-new-node @add-new-node="add"></add-new-node>
          </p>
        </Panel>
      </Collapse>
    </div>
  </div>
</template>

<script>
  import AddNewNode from './AddNewNode'
  import Vue from 'vue'

  export default {
    name: 'json-node',
    props: ['prop', 'value'],
    components: {
      'json-node': this,
      'add-new-node': AddNewNode
    },
    methods: {
      add (params) {
        var name = params.name
        var type = params.type
        const nameToNew = {
          Object: {},
          Array: [],
          String: '',
          Number: 0,
          Boolean: false
        }
        var newItem = nameToNew[type]
        if (this.isArray(this.value)) {
          this.value.push(newItem)
        } else if (this.isObject(this.value)) {
          Vue.set(this.value, name, newItem)
        }
      },
      isString (value) {
        return typeof value === 'string'
      },
      isBoolean (value) {
        return typeof value === 'boolean'
      },
      isNumber (value) {
        return typeof value === 'number'
      },
      isNull (value) {
        return value === null
      },
      isArray (value) {
        return Array.isArray(value)
      },
      isObject (value) {
        return !(Array.isArray(value)) && !(value === null) && (typeof value === 'object')
      }
    }
  }
</script>

<style scoped>
  .switch {
    display: inline-block;
  },
  Collapse {
    margin-bottom: 10px;
  }
</style>
