<template>
  <div id="app" style="width: 85%" class="ml-5">
    <HomePage />
  </div>
</template>

<script>
import HomePage from './components/HomePage.vue'

export default {
    name: 'App',
    data() {
        return {
            selectedList: this.$store.state.selectedItem,
        }
    },
    components: {
        HomePage,
    },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
