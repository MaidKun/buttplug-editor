<template>
  <div id="app">
    <div class="fullscreen">
      <Workspace />
    </div>
    <div class="popup-background fullscreen" v-if="popupOpen">
      <component :is="popup" v-bind="popupProps" />
    </div>
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
export default class App extends Vue {
  popup?: Vue;
  popupOpen = false;
  popupProps?: unknown;

  created() {
    this.$root.$on('popup', this.openPopup.bind(this));
    this.$root.$on('popupclose', this.closePopup.bind(this));
  }

  openPopup(component: Vue, props?: unknown) {
    this.popup = component;
    this.popupOpen = true;
    this.popupProps = props;
  }

  closePopup() {
    this.popupOpen = false;
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}

.fullscreen {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
}

.popup-background {
  z-index: 50;
  background-color: rgba(0,0,0,0.5);
  align-items: center;
  justify-content: center;
}
</style>
