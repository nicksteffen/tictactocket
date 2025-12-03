<template>
  <div class="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
    <div class="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50">
      <div v-if="store.messages.length === 0" class="text-center text-gray-400 italic mt-4">
        No messages yet
      </div>
      <div
        v-for="(msg, index) in store.messages"
        :key="index"
        class="p-2 bg-blue-100 text-blue-800 rounded-md self-start max-w-[80%]"
      >
        {{ msg }}
      </div>
    </div>
    <div class="p-4 bg-gray-100 border-t border-gray-200">
      <form @submit.prevent="sendMessage" class="flex space-x-2">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type a message..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="!store.isConnected"
        />
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          :disabled="!store.isConnected || !newMessage.trim()"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWebSocketStore } from '~/stores/websocket'

const store = useWebSocketStore()
const newMessage = ref('')

const sendMessage = () => {
  if (newMessage.value.trim()) {
    store.sendMessage(newMessage.value)
    newMessage.value = ''
  }
}
</script>
