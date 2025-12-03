<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto space-y-6">
      <header class="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">Nuxt 3 WebSocket Demo</h1>
        <ConnectionStatus />
      </header>

      <main class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-1 space-y-4">
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h2 class="text-lg font-semibold mb-4">Controls</h2>
            <div class="space-y-2">
              <button
                @click="connect"
                class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                :disabled="store.isConnected"
                :class="{ 'opacity-50 cursor-not-allowed': store.isConnected }"
              >
                Connect
              </button>
              <button
                @click="disconnect"
                class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                :disabled="!store.isConnected"
                :class="{ 'opacity-50 cursor-not-allowed': !store.isConnected }"
              >
                Disconnect
              </button>
            </div>
            <div v-if="store.error" class="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
              {{ store.error }}
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm">
             <h3 class="text-md font-medium text-gray-700 mb-2">Debug Info</h3>
             <p class="text-sm text-gray-500">
               Connecting to: <code class="bg-gray-100 px-1 rounded">wss://echo.websocket.org</code>
             </p>
          </div>
        </div>

        <div class="md:col-span-2 h-[500px]">
          <ChatLog />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWebSocketStore } from '~/stores/websocket'

const store = useWebSocketStore()

const connect = () => {
  // Using a public echo server for demonstration
  store.connect('wss://echo.websocket.org')
}

const disconnect = () => {
  store.disconnect()
}
</script>
