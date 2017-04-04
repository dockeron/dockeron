<template>
  <div>
    <Form :model="credentials" inline>
      <Form-item prop="username">
        <Input type="text" v-model="credentials.username" placeholder="Username">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </Form-item>
      <Form-item prop="password">
        <Input type="password" v-model="credentials.password" placeholder="Password">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </Form-item>
      <Form-item>
        <Button type="primary" @click="login">Login</Button>
      </Form-item>
    </Form>
    <pre>{{error}}</pre>
  </div>
</template>

<script>
  // import docker from '../../js/docker'

  export default {
    data () {
      return {
        credentials: {
          username: '',
          password: ''
        },
        auth: '',
        error: {}
      }
    },
    methods: {
      login () {
        //
      }
    }
  }
</script>

<style scoped>

</style>
