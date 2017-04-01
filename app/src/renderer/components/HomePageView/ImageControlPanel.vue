<template>
  <div>
    <!--  -->
  </div>
</template>

<script>
  import docker from '../../js/docker'

  export default {
    props: {
      imageId: String
    },
    methods: {
      inspectImage () {
        var self = this
        var image = docker.getImage(self.imageId)

        function imageRefreshed (data) {
          console.log('inspect: ', data)
          self.$emit('image-data-refreshed', data)
        }

        function imageErrored (err) {
          console.log('inspect: ', err)
          self.$emit('image-data-errored', err)
        }

        image.inspect()
          .then(imageRefreshed)
          .catch(imageErrored)
      }
    },
    created () {
      this.inspectImage()
    }
  }
</script>

<style scoped>

</style>
