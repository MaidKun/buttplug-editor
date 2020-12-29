<template>
  <div>
    <button>
      <span v-if="status === 'disconnected'">
        <i class="text-danger fas fa-circle"></i> No Connections
      </span>
      <span v-if="status === 'connecting'">
        <i class="text-warning fas fa-spin fa-circle-notch"></i> Connecting
      </span>
      <span v-if="status === 'connected'">
        <i class="text-success fas fa-circle"></i> {{manager.connections.length}} Connection(s)
      </span>
    </button>
  </div>
</template>

<script lang="ts">
import ConnectionManager, { ConnectionManagerState } from '@/connection/ConnectionManager';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class ConnectionIndicator extends Vue {
  status: ConnectionManagerState = 'disconnected';

  isMounted = false;

  @Prop()
  manager!: ConnectionManager;

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
    this.status = this.manager.state;
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
}
</script>

<style lang="scss">

</style>