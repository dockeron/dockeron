<template>
  <div>
    <div v-if="isArray(value)">
      <Collapse>
        <Panel>
          {{prop}}
          <p slot="content">
            <template v-for="(item, index) in value">
              <setting-item :prop="index.toString()" :value="item"></setting-item>
            </template>
            <Button type="primary" shape="circle" icon="plus-round"
                @click="add">
            </Button>
            <Button type="primary" shape="circle" icon="minus-round"
                @click="reduce">
            </Button>
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
        <Input v-model="value" :placeholder="value.toString()"></Input>
      </Form-item>
    </div>
    <div v-else-if="isObject(value)">
      <Collapse>
        <Panel>
          {{prop}}
          <p slot="content">
            <template v-for="(subvalue, subprop) in value">
              <setting-item :prop="subprop" :value="subvalue"></setting-item>
            </template>
          </p>
        </Panel>
      </Collapse>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'setting-item',
    props: ['prop', 'value'],
    components: {
      'setting-item': this
    },
    methods: {
      add () {
        this.value.push('')
      },
      reduce () {
        this.value.pop()
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
