<template>
  <div class="flex-rows">
    <slot />
  </div>
</template>

<script lang="ts">
import Project from '@/project/Project';
import { Component, Prop, Provide, Vue } from 'vue-property-decorator';

@Component
export default class ProjectProvider extends Vue {
  @Provide()
  @Prop()
  project!: Project;
}

</script>
