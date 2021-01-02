<template>
  <div class="flex-columns">
    <WorkspaceMenu :project="project" v-on:projectchanged="setProject" />
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
import WorkspaceMenu from './WorkspaceMenu.vue';
import WorkspaceFooter from './WorkspaceFooter.vue';
import Project from '@/project/Project';
import ConnectionManager from '@/connection/ConnectionManager';

@Component({
  components: {
    NodeEditor,
    ComponentBrowser,
    WorkspaceMenu,
    WorkspaceFooter,
  },
})
export default class Workspace extends Vue {
  project = new Project(new ConnectionManager())

  created() {
    this.project.initialize();
  }

  setProject(project: Project) {
    this.project = project;
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
