<template>
  <footer id="workspace-footer">
    <div class="flex-stretch"></div>
    <ConnectionIndicator :manager="project.connections" />
  </footer>
</template>

<script lang="ts">
import Project from '@/project/Project';
import ConnectionIndicator from '../connection/ConnectionIndicator.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
    ConnectionIndicator
  }
})
export default class WorkspaceFooter extends Vue {
  @Prop()
  project!: Project;
}
</script>

<style lang="scss">
#workspace-footer {
  display: flex;
  height: 25px;
  background: #444;
  border-top: 1px solid #222;
}

#workspace-footer div {
  border-left: 1px solid #222;
}

#workspace-footer div > button {
  background: none;
  border: none;
  color: #eee;
  cursor: pointer;
  height: 24px;
  line-height: 24px;
  padding: 0 10px;

  &:hover {
    background-color: rgba(255,255,255,0.1);
  }
}
</style>