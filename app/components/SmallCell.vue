<template>
  <button 
    class="w-full aspect-square flex items-center justify-center text-4xl font-bold transition-all duration-300 border border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
    :class="{ 
      // Default classes for an empty cell
      'bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2': !token,

      // Visuals for an occupied cell (non-interactive)
      'cursor-default': !!token,
      // Only apply gray background if occupied AND NOT highlighted (not last move)
      'bg-gray-50': !!token && !highlight,

      // *** Last Move Highlight (now driven by the 'highlight' prop) ***
      'bg-yellow-200 shadow-lg shadow-yellow-400/50 transform scale-[1.01]': highlight,
    }"
    :disabled="!!token"
    @click="$emit('cellClick')"
  >
    <span 
      v-if="token" 
      class="transform transition-transform duration-200"
      :class="{ 
        // Token Colors (default)
        'text-red-600 scale-100': token === 'X' && !highlight, 
        'text-blue-600 scale-100': token === 'O' && !highlight,
        
        // Highlighted Token Colors (for last move)
        // Note: Using 'text-white' might require testing on the yellow background
        // but 'text-red-600' and 'text-blue-600' should still stand out well.
        'text-white scale-110': highlight,
        
        // Increase text size slightly for last move for pop
        'scale-105': highlight
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
  highlight: boolean;
}>();

// Defines the custom event the component can emit
defineEmits(['cellClick']);
</script>