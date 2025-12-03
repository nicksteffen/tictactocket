<script setup lang="ts">
import { storeToRefs } from 'pinia';
import SmallCell from './SmallCell.vue';
import { computed } from 'vue';
import { useGameStore } from '../stores/gamemanager';
import type { SmallBoardDto } from '~~/types/game';

const props = defineProps<{ board: SmallBoardDto }>();
const gameStore = useGameStore();
const gameId = computed(() => gameStore.gameId);
const {requestMove } = useGameSocket();

const valToToken = (val: Number) => {
    if (val === 1) return 'X';
    if (val === 2) return 'O';
    return '';
}

// Determine if this board is currently playable
const isPlayable = computed(() => {
    // Board is playable if nextBoard is -1 (any board) or matches this board's index
    return props.board.isAvailable && (gameStore.nextBoard === -1 || gameStore.nextBoard === props.board.index);
});

const handleCellClick = (boardId: number, index: number) => {
    if (gameStore.currentPlayer !== gameStore.playerId) return;

    const target = gameStore.playerId;
    requestMove(gameId.value, boardId, index, target, gameStore.currentPlayer);
}

</script>

<template>
    <Board :isAvailable="board.isAvailable" :winner="board.winner" :isPlayable="isPlayable">
        <SmallCell v-for="(cell, index) in board.board" :key="index" :token="valToToken(cell)" i
        @cellClick="handleCellClick(board.index, index)">
        </SmallCell>
    </Board>
</template>