<template>
  <div class="tictactoe-board-container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// No logic here, just structural layout.
</script>

<style scoped>
.tictactoe-board-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  /* Ensure the container itself has no gap/padding that would break the lines */
  gap: 0; 
  border: 1px solid #333; /* Optional: Outer border for the whole board */
}
</style>