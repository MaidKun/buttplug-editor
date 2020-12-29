<template>
  <div class="flex-columns">
    <div class="flex-rows">
      <div id="workspace-sidebar">
        <ComponentBrowser :nodes="project.nodes" />
      </div>
      <div class="flex-rows">
        <NodeEditor :project="project" />
      </div>
    </div>
    <WorkspaceFooter :project="project" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ComponentBrowser from './ComponentBrowser.vue';
import NodeEditor from '../NodeEditor.vue';
import WorkspaceFooter from './WorkspaceFooter.vue';
import Project from '@/project/Project';

@Component({
  components: {
    NodeEditor,
    ComponentBrowser,
    WorkspaceFooter,
  },
})
export default class Workspace extends Vue {
  project = new Project()

  created() {
    this.project.initialize();
  }
}
</script>

<style lang="scss">
#workspace {
  flex-direction: column;
}

#workspace,
#workspace-main {
  flex: 1;
  display: flex;
}
#workspace-sidebar {
  width: 250px;
  display: flex;
}
#workspace-editor {
  flex: 1;
}
</style>
