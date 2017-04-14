<template>
  <div v-if="value" class="logout">
    <Poptip trigger="hover" placement="bottom">
      <Tag type="dot" color="green">{{credentials.username}}</Tag>
      <div slot="content">
        <Button @click="logout" icon="logout">Logout</Button>
      </div>
    </Poptip>
  </div>
  <div v-else class="login">
    <Poptip placement="bottom-end">
      <Button class="login-button" icon="person">Login</Button>
      <div slot="content">
        <Form :model="credentials">
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
            <Button class="go-button" type="primary" @click="login">Go</Button>
          </Form-item>
        </Form>
      </div>
    </Poptip>
  </div>
</template>

<script>
  import dockerHubApi from 'docker-hub-api'

  import notify from '../../js/notify'

  export default {
    props: {
      // access token
      value: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        credentials: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      login () {
        var self = this

        function loginSuccess (token) {
          self.$emit('input', token)
          notify('Welcome, ' + self.credentials.username + ' !')
        }

        function loginFailed (err) {
          notify(err)
          self.$emit('input', '')
        }

        dockerHubApi.login(this.credentials.username, this.credentials.password)
          .then(loginSuccess)
          .catch(loginFailed)
      },
      logout () {
        notify('Goodbye, ' + this.credentials.username + ' !')
        this.credentials = {
          username: '',
          password: ''
        }
        this.$emit('input', '')
      }
    }
  }
</script>

<style scoped>
  .login {
    display: inline-block;
    float: right;
  }

  .logout {
    display: inline-block;
    float: right;
  }

  .go-button {
    float: right;
  }
</style>
