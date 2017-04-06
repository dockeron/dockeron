<template>
  <div>
    topProcesses:
    <pre>{{topResult}}</pre>
  </div>
</template>

<script>

  export default {
    props: ['topResult'],
    methods: {
      initialize () {
        console.log('display topResult')
      }
    },
    created () {
      this.initialize()
    }
  }
</script>
