<template>
  <div id="app">
    <Workspace />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Workspace from './components/workspace/Workspace.vue';

@Component({
  components: {
    Workspace,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
