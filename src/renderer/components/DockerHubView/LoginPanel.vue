<template>
  <div class="login">
    <div v-if="token">
      <Tag type="dot" color="green">{{credentials.username}}</Tag>
      <Button @click="logout" icon="logout" size="small">Logout</Button>
    </div>
    <div v-else>
      <Button class="login-button" icon="person" size="small" @click="loginModal=true">Login</Button>
    </div>
    <Modal class="login-modal" v-model="loginModal" title="Login to Docker Hub" @on-ok="login">
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
      </Form>
    </Modal>
  </div>
</template>

<script>
  import {
    VUEX_ACTION_LOGIN,
    VUEX_ACTION_LOGOUT
  } from '../../js/constants/VuexConstants'

  export default {
    data () {
      return {
        loginModal: false,
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
        this.loginModal = false
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
      this.$store.watch(state => state.auth.token, newToken => {
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

</style>
