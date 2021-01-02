<template>
  <div class="workspace-menu">
    <ul>
      <li><button v-on:click="newProject">New</button></li>
      <li><button class="file-button">Load <input type="file" @change="loadProject" accept="text/json, .json"></button></li>
      <li><button v-on:click="saveProject">Save</button></li>
    </ul>
  </div>  
</template>

<script lang="ts">
import Project from '@/project/Project';
import ProjectFileInterface from '@/project/ProjectFileInterface';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
  }
})
export default class WorkspaceMenu extends Vue {
  @Prop()
  project!: Project;
  
  async newProject() {
    if (!confirm('This will clear the entire workspace.')) {
      return;
    }

    const project = new Project(this.project.connections);
    await project.initialize();
    this.$emit('projectchanged', project);
  }

  loadProject(event: InputEvent) {
    if (!event.target) {
      return;
    }
    
    const files = (event.target as HTMLInputElement).files;
    if (!files || !files.length) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target) {
        return;
      }

      const data = JSON.parse(event.target.result as string) as ProjectFileInterface;
      if (!data) {
        alert('The uploaded file could not be parsed as JSON.');
        return;
      }

      Project.load(data, this.project.connections).then(project => {
        this.$emit('projectchanged', project);
      }).catch(err => {
        alert(err);
      });
    }
    reader.readAsText(files[0]);
  }

  saveProject() {
    this.project.save();
  }
}
</script>

<style lang="scss">
.workspace-menu {
  background: #444;
  border-bottom: 1px solid #222;
  height: 30px;

  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
    display: inline-block;
    height: 30px;
    overflow: hidden;
  }

  li button,
  .file-button {
    display: block;
    padding: 7px 14px;
    background: transparent;
    border: none;
    color: #eee;
    cursor: pointer;

    &:hover {
      background-color: rgba(255,255,255,0.1);
    }
  }
}


.file-button {
  position: relative;
  display: block;
  overflow: hidden;
  height: 30px;

  input {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    opacity: 0;
    z-index: 0;
    cursor: pointer;
  }
}
</style>