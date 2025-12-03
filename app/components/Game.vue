<template>
    <div class="board-page">
        <div class="board-container">
            <TicTacToeBoard>
                <SmallBoard 
                    v-for="(board, index) in boardState.boards" 
                    :key="index" 
                    :board="board"
                />
            </TicTacToeBoard>
        </div>
        <button class="new-game-btn" @click="reset()">New Game</button>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import SmallBoard from '../components/SmallBoard.vue';
import TicTacToeBoard from '../components/TicTacToeBoard.vue';
import { useGameStore } from '../stores/gamemanager';
import { useGameSocket } from '../composables/useGameSocket';

const socket = useGameSocket();
const {requestReset} = socket;
const gameStore = useGameStore();
const {gameId} = storeToRefs(gameStore);
const {boardState} = storeToRefs(gameStore);

function reset() {
    if (!gameId.value) return;
    requestReset(gameId.value);
}
</script>

<style scoped>
.board-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    gap: 1.5rem;
    box-sizing: border-box;
}

.board-container {
    width: 100%;
    max-width: min(90vh, 90vw); /* Ensures board fits within viewport */
    aspect-ratio: 1 / 1; /* Keeps the overall board square */
}

.new-game-btn {
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: bold;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.new-game-btn:hover {
    background-color: #45a049;
}

.new-game-btn:active {
    background-color: #3d8b40;
}
</style>
