<template>
  <div>
    <div class="docker-hub-panel">
      <search-panel v-model="searchedImages"></search-panel>
      <login-panel v-model="token"></login-panel>
    </div>
    <br><br>
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
  import SearchPanel from './SearchPanel'
  import LoginPanel from './LoginPanel'

  export default {
    components: {
      SearchPanel,
      LoginPanel
    },
    data () {
      return {
        token: '',
        searchedImages: [],
        booleanToTagColor: {
          'true': 'green',
          'false': 'red'
        }
      }
    }
  }
</script>

<style scoped>
  .docker-hub-panel {
    display: inline-block;
    float: right;
    width: 350px;
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
