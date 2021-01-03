<template>
  <span class="connection-list-item">
    <span class="connection-list-item-status">
      <span v-if="item.status === 'disconnected'">
        <i class="text-danger fas fa-circle"></i>
      </span>
      <span v-if="item.status === 'connecting'">
        <i class="text-warning fas fa-spin fa-circle-notch"></i>
      </span>
      <span v-if="item.status === 'connected'">
        <i class="text-success fas fa-circle"></i>
      </span>
    </span>

    <span class="connection-list-item-name">
      <small>{{item.configuration.protocol}}</small>
      <strong>ws://{{item.configuration.address}}:{{item.configuration.port}}/</strong>
    </span>

    <Button v-if="item.status === 'disconnected'" v-on:click="retry"><i class="fas fa-sync"></i></Button>
    <Button v-if="item.status === 'connected'" v-on:click="disconnect"><i class="fas fa-stop"></i></Button>
  </span>
</template>

<script lang="ts">
import { ConnectionConfigurationStatus } from '@/connection/ConnectionManager';
import { Component, Prop, Vue } from 'vue-property-decorator';
import Button from '../ui/Button.vue';

@Component({
  components: {
    Button
  }
})
export default class ConnectionListItem extends Vue {
  @Prop()
  item!: ConnectionConfigurationStatus;

  retry() {
    this.$emit('retry', this.item);
  }

  disconnect() {
    this.$emit('disconnect', this.item);
  }
}
</script>

<style lang="scss">
.connection-list-item {
  display: flex;
  padding: 10px;
}

.connection-list-item-status {
  width: 32px;
}

.connection-list-item-name {
  display: block;
  flex: 1;

  small {
    display: inline-block;
    width: 70px;
  }
}
</style>
