<template>
  <div>
    <Dropdown @on-click="openInputName" style="margin-left: 20px">
      <a href="javascript:void(0)">
        <Icon type="plus-round"></Icon>
        Add new
        <Icon type="arrow-down-b"></Icon>
      </a>
      <Dropdown-menu slot="list">
        <Dropdown-item name="Object">Object</Dropdown-item>
        <Dropdown-item name="Array">Array</Dropdown-item>
        <Dropdown-item name="String">String</Dropdown-item>
        <Dropdown-item name="Number">Number</Dropdown-item>
        <Dropdown-item name="Boolean">Boolean</Dropdown-item>
      </Dropdown-menu>
    </Dropdown>
    <Modal v-model="nameInput" @on-ok="add">
      <Input v-model="name" placeholder="Please give a name."></Input>
    </Modal>
  </div>
</template>

<script>
  export default {
    props: {
      isArray: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        type: '',
        name: '',
        nameInput: false
      }
    },
    methods: {
      openInputName (type) {
        this.type = type
        this.nameInput = !this.isArray
        if (this.isArray) {
          this.add()
        }
      },
      add () {
        var params = {
          type: this.type,
          name: this.name
        }
        this.$emit('add-new-node', params)
      }
    }
  }
</script>

<style scoped>

</style>
