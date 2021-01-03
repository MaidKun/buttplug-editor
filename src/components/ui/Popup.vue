<template>
  <div class="popup">
    <div class="popup-header">
      <h2>{{header}}</h2>
      <Button v-on:click="close"><i class="fas fa-times"></i></Button>
    </div>
    <div class="popup-body">
      <slot />
    </div>
    <div class="popup-footer">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Button from './Button.vue';

@Component({
  components: {
    Button
  }
})
export default class ConnectionListWindow extends Vue {
  @Prop({default: ''})
  header!: string;

  close() {
    this.$root.$emit('popupclose');
  }
}
</script>

<style lang="scss">
.popup {
  width: 600px;
  height: 80vh;
  min-height: 200px;
  background: #444;
  border: 1px solid #222;
  color: #eee;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  border-bottom: 1px solid #222;

  h2 {
    display: block;
    flex: 1;
    font-size: 20px;
    font-weight: normal;
    margin: 0;
    padding: 5px 10px;
  }
}

.popup-body {
  flex: 1;
}

.popup-footer {
  display: flex;
  border-top: 1px solid #222;
  padding: 5px;
}
</style>
