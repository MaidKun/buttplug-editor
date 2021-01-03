<template>
  <button class="btn" v-on:click="click">
    <slot />
  </button>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Button extends Vue {
  click() {
    this.$emit('click');
  }
}
</script>

<style lang="scss">
.btn {
  display: inline-block;
  padding: 7px 14px;
  background: transparent;
  border: none;
  color: #eee;
  cursor: pointer;

  &:hover {
    background-color: rgba(255,255,255,0.1);
  }
}
</style>
