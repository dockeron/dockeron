<template>
  <div>
    <Form :label-width="labelWidth">
      <json-node v-model="value" :prop="name"></json-node>
    </Form>
  </div>
</template>

<script>
  import JsonNode from './JsonNode'

  export default {
    components: {
      JsonNode
    },
    props: {
      labelWidth: {
        type: Number,
        default: 40
      },
      name: {
        type: String,
        default: ''
      },
      // JSON data
      value: [Object, Array]
    }
  }
</script>

<style scoped>

</style>
