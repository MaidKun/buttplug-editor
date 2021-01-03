<template>
  <Popup header="Connections">
    <div class="scroll-container">
      <ul class="connection-list">
        <li v-for="status of configurations" :key="status.configuration.protocol + '|' + status.configuration.address + '|' + status.configuration.port">
          <ConnectionListItem :item="status" v-on:retry="retry" v-on:disconnect="disconnect" />
        </li>
      </ul>
    </div>
  </Popup>
</template>

<script lang="ts">
import ConnectionManager, { ConnectionConfigurationStatus } from '@/connection/ConnectionManager';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Popup from '../ui/Popup.vue';
import ConnectionListItem from './ConnectionListItem.vue';

@Component({
  components: {
    Popup,
    ConnectionListItem
  }
})
export default class ConnectionListWindow extends Vue {
  isMounted = false;

  @Prop()
  manager!: ConnectionManager;

  configurations: ConnectionConfigurationStatus[] = [];

  @Watch('manager')
  onManagerChanged(manager: ConnectionManager, oldManager: ConnectionManager) {
    if (oldManager) {
      oldManager.removeEventListener('changed', this.onChange.bind(this));
    }
    if (manager && this.isMounted) {
      manager.addEventListener('changed', this.onChange.bind(this));
    }
    this.onChange();
  }

  onChange() {
    this.configurations = this.manager.configurations;
  }

  mounted() {
    this.isMounted = true;
    this.manager.addEventListener('changed', this.onChange.bind(this));
    this.onChange();
  }

  beforeDestroy() {
    this.isMounted = false;
    this.manager.removeEventListener('changed', this.onChange.bind(this));
  }

  retry(item: ConnectionConfigurationStatus) {
    this.manager.connect(item);
  }

  disconnect(item: ConnectionConfigurationStatus) {
    this.manager.disconnect(item);
  }
}
</script>

<style lang="scss">
.connection-list-popup {
  width: 600px;
  height: 80vh;
  min-height: 200px;
}

.connection-list,
.connection-list li {
  display: block;
  margin: 0;
  padding: 0;
  list-style: none;
}

.connection-list {
  li {
    border-bottom: 1px solid #333;
  }
}
</style>
