<template>
  <div>
    <Form :model="newContainer" :label-width="80">
      <Form-item label="Image" required>
        <Input v-model="newContainer.image" placeholder="Image Name"></Input>
      </Form-item>
      <Form-item label="Name">
        <Input v-model="newContainer.name" placeholder="New name of your container"></Input>
      </Form-item>
      <Form-item label="Cmd">
        <Input v-model="newContainer.Cmd" placeholder="Default: /bin/bash"></Input>
      </Form-item>
      <Form-item label="Tty" class="switch">
        <i-switch v-model="newContainer.Tty" size="large">
          <span slot="open">true</span>
          <span slot="close">false</span>
        </i-switch>
      </Form-item>
      <Form-item label="OpenStdin" class="switch">
        <i-switch v-model="newContainer.OpenStdin" size="large">
          <span slot="open">true</span>
          <span slot="close">false</span>
        </i-switch>
      </Form-item>
      <Form-item label="StdinOnce" class="switch">
        <i-switch v-model="newContainer.StdinOnce" size="large">
          <span slot="open">true</span>
          <span slot="close">false</span>
        </i-switch>
      </Form-item>
    </Form>
  </div>
</template>

<script>
  // import docker from '../../js/docker'

  export default {
    data () {
      return {
        newContainer: {
          Image: '',
          name: '',
          Cmd: '/bin/bash',
          Tty: false,
          OpenStdin: false,
          StdinOnce: false
        }
      }
    },
    methods: {
      submit () {
        console.log('submit: ', this.newContainer)

        this.reset()
      },
      reset () {
        console.log('reset')
        this.newContainer = {
          Image: '',
          name: '',
          Cmd: '/bin/bash',
          Tty: false,
          OpenStdin: false,
          StdinOnce: false
        }
      }
    }
  }
</script>

<style scoped>
  .switch {
    display: inline-block;
  }
</style>
