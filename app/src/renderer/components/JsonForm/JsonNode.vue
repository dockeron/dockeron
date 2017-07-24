<template>
  <div>
    <div v-if="isArray(internalValue)">
      <Collapse>
        <Panel>
          {{prop}}
          <Poptip confirm title="Delete this?" @on-ok="deleteNode">
            <Button class="delete-button" type="ghost" shape="circle" icon="close-round" size="small"></Button>
          </Poptip>
          <p slot="content">
            <template v-for="(item, index) in internalValue">
              <json-node :prop="index.toString()" v-model="internalValue[index]"></json-node>
            </template>
            <add-new-node :is-array="true" @add-new-node="add"></add-new-node>
          </p>
        </Panel>
      </Collapse>
    </div>
    <div v-else-if="isObject(internalValue)">
      <Collapse>
        <Panel>
          {{prop}}
          <p slot="content">
            <template v-for="(subValue, subProp) in internalValue">
              <json-node :prop="subProp" v-model="internalValue[subProp]"></json-node>
            </template>
            <add-new-node @add-new-node="add"></add-new-node>
          </p>
        </Panel>
      </Collapse>
    </div>
    <div v-else-if="isString(internalValue)">
      <Form-item :label="prop">
        <Input v-model="internalValue" :placeholder="internalValue"></Input>
      </Form-item>
    </div>
    <div v-else-if="isNumber(internalValue)">
      <Form-item :label="prop" class="switch">
        <Input-number v-model="internalValue"></Input-number>
      </Form-item>
    </div>
    <div v-else-if="isBoolean(internalValue)">
      <Form-item :label="prop" class="switch">
        <i-switch v-model="internalValue" size="large">
          <span slot="open">true</span>
          <span slot="close">false</span>
        </i-switch>
      </Form-item>
    </div>
    <div v-else>
      <Form-item :label="prop">
        {{internalValue}}
      </Form-item>
    </div>
  </div>
</template>

<script>
  import AddNewNode from './AddNewNode'
  import Vue from 'vue'

  export default {
    name: 'json-node',
    data () {
      return {
        internalValue: this.value
      }
    },
    props: {
      prop: [String, Number],
      value: null
    },
    components: {
      'json-node': this,
      'add-new-node': AddNewNode
    },
    watch: {
      value: function (newValue) {
        this.internalValue = newValue
      },
      internalValue: function (newValue) {
        this.$emit('input', newValue)
      }
    },
    methods: {
      add (params) {
        var name = params.name
        var type = params.type

        const nameToNew = {
          Array: [],
          Object: {},
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
      deleteNode () {
        // TODO (fluency03): delete a prop
        this.$emit('delete-this-node')
      },
      isArray (value) {
        return Array.isArray(value)
      },
      isObject (value) {
        return (!(Array.isArray(value)) &&
                !(value === null) &&
                (typeof value === 'object'))
      },
      isString (value) {
        return typeof value === 'string'
      },
      isNumber (value) {
        return typeof value === 'number'
      },
      isBoolean (value) {
        return typeof value === 'boolean'
      },
      isNull (value) {
        return value === null
      }
    }
  }
</script>

<style scoped>
  .switch {
    display: inline-block;
  }

  .delete-button {
    margin: auto;
  }

  Collapse {
    margin-bottom: 10px;
  }
</style>
