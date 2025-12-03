<template>
  <div class="board" :class="{ 'board--unavailable': !isAvailable, 'board--playable': isPlayable }">
    <div class="board__grid">
      <slot></slot>
    </div>
    <!-- Overlay for won boards -->
    <div v-if="winner !== 0" class="board__overlay">
      <span class="board__winner-token" :class="{ 'token--x': winner === 1, 'token--o': winner === 2 }">
        {{ winner === 1 ? 'X' : 'O' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Accept props for board state
defineProps<{
  isAvailable?: boolean;
  winner?: number;
  isPlayable?: boolean; // Indicates if this board is currently playable
}>();
</script>

<style scoped>
.board {
  /* Visual styling for the board border - darker color to distinguish from cell borders */
  position: relative; /* For absolute positioning of overlay */
  border: 4px solid #2c3e50; /* Dark blue-gray for classic tic-tac-toe look */
  border-radius: 5px;
  padding: 5px;
  background-color: #fff;
  transition: opacity 0.3s, background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
}

.board--unavailable {
  opacity: 0.5;
  background-color: #e0e0e0;
  pointer-events: none; /* Prevent interactions with unavailable boards */
}

.board--playable {
  border-color: #10b981; /* Green border for playable boards */
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.5); /* Glowing effect */
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.8);
  }
}

.board__grid {
  /* Core CSS Grid definition for 3x3 layout */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* The gap should be smaller or non-existent here if the inner elements (SmallCell) handle their own borders */
  gap: 0; 
}

.board__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 5px;
  pointer-events: none; /* Allow clicks to pass through if needed */
}

.board__winner-token {
  font-size: 8rem;
  font-weight: bold;
  opacity: 0.9;
}

.token--x {
  color: #ef4444; /* Red for X */
}

.token--o {
  color: #3b82f6; /* Blue for O */
}
</style>