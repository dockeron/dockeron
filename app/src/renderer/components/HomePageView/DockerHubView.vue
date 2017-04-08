<template>
  <div>
    <div class="docker-hub-panel">
      <Poptip placement="bottom">
        <Input class="search-input" icon="ios-search" v-model="searchTerm" @on-click="search">
        </Input>
        <div slot="content">
          Limit: <Input-number v-model="searchLimit"></Input-number>
          <Checkbox-group class="filter-option" v-model="selectedFilters">
            <Checkbox label="is-automated">Automated</Checkbox>
            <Checkbox label="is-official">Official</Checkbox>
            <Checkbox label="stars">Stars</Checkbox>
          </Checkbox-group>
          <p class="filter-option">
            Automated:
            <i-switch v-model="searchFilters['is-automated']" size="large">
              <span slot="open">true</span>
              <span slot="close">false</span>
            </i-switch>
          </p>
          <p class="filter-option">
            Official:
            <i-switch v-model="searchFilters['is-official']" size="large">
              <span slot="open">true</span>
              <span slot="close">false</span>
            </i-switch>
          </p>
          <p class="filter-option">
            Stars: <Input-number v-model="searchFilters['stars']"></Input-number>
          </p>
        </div>
      </Poptip>
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
            <Form class="login-form" :model="credentials">
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
    </div>
    <br>
    <Card v-for="image in searchedImages" class="image-card">
      <p slot="title" class="image-card-title">
        {{image.name}}
        <Tag class="image-star-count-tag" color="blue">
          {{image.star_count}}
        </Tag>
      </p>
      <p>
        <Tooltip>
          Description: {{image.description.slice(0, 20)}} ...
          <div slot="content" class="description-pop">
            {{image.description}}
          </div>
        </Tooltip>
      </p>
      <p>
        Official:
        <Tag :color="booleanToTagColor[image.is_official]">{{image.is_official}}</Tag>
        Automated:
        <Tag :color="booleanToTagColor[image.is_automated]">{{image.is_automated}}</Tag>
      </p>
    </Card>
  </div>
</template>

<script>
  import dockerHubApi from 'docker-hub-api'

  import docker from '../../js/docker'
  import notify from '../../js/notify'

  export default {
    data () {
      return {
        credentials: {
          username: '',
          password: ''
        },
        token: '',
        error: '',
        searchTerm: '',
        searchLimit: 15,
        searchedImages: [],
        selectedFilters: [],
        searchFilters: {
          'is-automated': true,
          'is-official': true,
          'stars': 0
        },
        booleanToTagColor: {
          true: 'green',
          false: 'red'
        }
      }
    },
    methods: {
      login () {
        var self = this

        function loginSuccess (token) {
          self.token = token
          self.error = ''
          notify('Welcome, ' + self.credentials.username + ' !')
        }

        function loginFailed (err) {
          notify(err)
          self.token = ''
          self.error = err
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
        this.token = ''
      },
      search () {
        var self = this

        var searchParams = {
          term: this.searchTerm,
          limit: this.searchLimit
        }

        var searchFilters = {}
        this.selectedFilters.forEach(function (filter) {
          searchFilters[filter] = self.searchFilters[filter]
        })

        console.log(searchFilters)

        function imagesSearched (images) {
          self.searchedImages = images
          notify(images.length + ' images found!')
        }

        docker.searchImages(searchParams)
          .then(imagesSearched)
          .catch(notify)
      }
    }
  }
</script>

<style scoped>
  .search-input {
    width: 200px;
    margin-right: 8px;
  }

  .login {
    display: inline-block;
  }

  .logout {
    display: inline-block;
  }

  .go-button {
    float: right;
  }

  .docker-hub-panel {
    display: inline-block;
    float: right;
    width: 320px;
  }

  .filter-option {
    margin-top: 10px;
  }

  .image-card {
    width: 300px;
    display: inline-block;
    margin: 5px 5px;
  }

  .image-card-title {
    height: 26px;
  }

  .image-star-count-tag {
    position: absolute;
    right: 3px;
  }

  .description-pop {
    white-space: pre-wrap;
  }
</style>
