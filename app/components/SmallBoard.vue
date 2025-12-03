<script setup lang="ts">
import { useBoardStore } from '@/stores/board';
import { storeToRefs } from 'pinia';
import SmallCell from './SmallCell.vue';
import { computed } from 'vue';
import type { smallBoardState } from '~~/types';
import { useGameStore } from '@/stores/gamemanager';

const props = defineProps<{ board: smallBoardState }>();
const boardStore = useBoardStore();
const gameStore = useGameStore();
const { nextBoard } = storeToRefs(boardStore);
const { game } = storeToRefs(gameStore);
const gameId = computed(() => game.value?.gameId || '');

const valToToken = (val: Number) => {
    if (val === 1) return 'X';
    if (val === 2) return 'O';
    return '';
}

// Determine if this board is currently playable
const isPlayable = computed(() => {
    // Board is playable if nextBoard is -1 (any board) or matches this board's index
    return props.board.isAvailable && (nextBoard.value === -1 || nextBoard.value === props.board.index);
});

</script>

<template>
    <Board :isAvailable="board.isAvailable" :winner="board.winner" :isPlayable="isPlayable">
        <SmallCell v-for="(cell, index) in board.board" :key="index" :token="valToToken(cell)" i
        @cellClick="boardStore.makeMove(gameId, board.index, index, boardStore.currentPlayer)">
        </SmallCell>
    </Board>
</template>