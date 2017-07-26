<template>
  <div v-if="token" class="logout">
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
  import { VUEX_ACTION_LOGIN, VUEX_ACTION_LOGOUT } from '../../js/constants/VuexConstants'

  export default {
    data () {
      return {
        credentials: {
          username: '',
          password: ''
        },
        token: ''
      }
    },
    methods: {
      login () {
        this.$store.dispatch(VUEX_ACTION_LOGIN, this.credentials)
      },
      logout () {
        this.$store.dispatch(VUEX_ACTION_LOGOUT)
        this.credentials = {
          username: '',
          password: ''
        }
      }
    },
    created () {
      this.token = this.$store.state.auth.token
      this.credentials.username = this.$store.state.user.username
      this.$store.watch((state) => {
        return state.auth.token
      }, (newToken) => {
        this.token = newToken
      })
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
