<template>
  <div class="flex-columns">
    <WorkspaceMenu :project="project" v-on:projectchanged="setProject" />
    <div class="flex-rows">
      <div id="workspace-sidebar">
        <ComponentBrowser :nodes="project.nodes" />
      </div>
      <ProjectProvider :project="project">
        <NodeEditor :project="project" v-if="showEditor" />
      </ProjectProvider>
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
import ProjectProvider from './ProjectProvider.vue';
import Project from '@/project/Project';
import ConnectionManager from '@/connection/ConnectionManager';

@Component({
  components: {
    NodeEditor,
    ComponentBrowser,
    WorkspaceMenu,
    WorkspaceFooter,
    ProjectProvider,
  },
})
export default class Workspace extends Vue {
  project = new Project(new ConnectionManager())
  showEditor = true;

  created() {
    this.project.initialize();
    this.project.connections.addDefaultConfigurations();
    this.project.connections.findConnections().catch(err => console.error(err));
  }

  async setProject(project: Project) {
    this.project.unload();
    this.project = project;
    
    this.showEditor = false;
    await this.$nextTick();
    this.showEditor = true;
  }
}
</script>

<style lang="scss">
#workspace {
  flex-direction: column;
  background: #333;
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
