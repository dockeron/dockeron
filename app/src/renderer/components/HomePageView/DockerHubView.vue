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
  import dockerHubApi from 'docker-hub-api'

  export default {
    data () {
      return {
        credentials: {
          username: '',
          password: ''
        },
        token: '',
        error: ''
      }
    },
    methods: {
      login () {
        var self = this

        function loginSuccess (token) {
          self.token = token
          /* eslint-disable no-new */
          new Notification('Dockeron', {
            body: 'Login Success!'
          })
        }

        function loginFailed (err) {
          console.warn(err)
          /* eslint-disable no-new */
          new Notification('Dockeron', {
            body: err
          })
          self.error = err
        }

        dockerHubApi.login(this.credentials.username, this.credentials.password)
          .then(loginSuccess)
          .catch(loginFailed)
      }
    }
  }
</script>

<style scoped>

</style>
