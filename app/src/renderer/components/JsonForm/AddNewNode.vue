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

    <!-- <Modal v-model="nameInput" @on-ok="add"> -->
    <div v-show="nameInput">
      <Input class="new-name-input" v-model="name" placeholder="Please give a name."></Input>
      <Button class="new-button" type="primary" icon="checkmark-round" shape="circle" @click="add" size="small"></Button>
      <Button class="new-button" type="ghost" icon="close-round" shape="circle" @click="cancel" size="small"></Button>
    </div>
    <!-- </Modal> -->
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
        this.nameInput = false
        this.name = ''
        this.type = ''
      },
      cancel () {
        this.nameInput = false
        this.name = ''
        this.type = ''
      }
    }
  }
</script>

<style scoped>
  .new-name-input {
    width: 30%;
  }
  .new-button {
    margin: auto;
  }
</style>
