<template>
  <button 
    class="w-full aspect-square flex items-center justify-center text-4xl font-bold transition-colors duration-200 border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    :class="{ 
      'hover:bg-gray-100': !token,
      'cursor-default': !!token
    }"
    @click="$emit('cellClick')"
  >
    <span 
      v-if="token" 
      class="transform transition-transform duration-200"
      :class="{ 
        'text-red-500 scale-100': token === 'X', 
        'text-blue-500 scale-100': token === 'O' 
      }"
    >
      {{ token }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// Defines the props accepted by the component
defineProps<{
  // The token to display: 'X', 'O', or '' (empty)
  token: string; 
}>();

// Defines the custom event the component can emit
defineEmits(['cellClick']);
</script>