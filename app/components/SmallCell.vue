<template>
  <button 
    class="cell" 
    :class="{ 'cell--empty': !token }"
    @click="$emit('cellClick')"
  >
    <span v-if="token" :class="{ 'text-red-500': token === 'X', 'text-blue-500': token === 'O' }">
      {{ token }}
    </span>
    <span v-else class="cell__indicator"></span>
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

<style scoped>
.cell {
  /* Basic cell styling for a clear 3x3 grid */
  width: 100%;
  aspect-ratio: 1 / 1; /* Ensures cells are always square */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  border: 1px solid #bbb; /* Lighter gray to contrast with darker board border */
  background-color: #f9f9f9;
  cursor: pointer;
  transition: background-color 0.1s;
}

.cell--empty:hover {
  background-color: #e0e0e0;
}

.cell__indicator {
  /* Subtle visual indicator when cell is empty and available */
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ddd;
}
.cell--empty:hover .cell__indicator {
  background-color: #999;
}
</style>