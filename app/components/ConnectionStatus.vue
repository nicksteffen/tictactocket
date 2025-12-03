<template>
  <div class="flex items-center space-x-2">
    <span class="relative flex h-3 w-3">
      <span
        v-if="store.isConnected"
        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
      ></span>
      <span
        class="relative inline-flex rounded-full h-3 w-3"
        :class="store.isConnected ? 'bg-green-500' : 'bg-red-500'"
      ></span>
    </span>
    <span class="text-sm font-medium text-gray-700">
      {{ store.isConnected ? 'Connected' : 'Disconnected' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useWebSocketStore } from '~/stores/websocket'

const store = useWebSocketStore()
</script>
