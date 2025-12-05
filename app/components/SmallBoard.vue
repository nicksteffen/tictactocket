<template>
    <div 
        class="relative grid grid-cols-3 gap-0.5 bg-gray-200 p-0.5 transition-all duration-300"
        :class="{
            'ring-4 ring-yellow-400 ring-offset-2 z-10': isPlayable && !board.winner,
            'opacity-50': !isPlayable && !board.winner,
            'bg-red-100': board.winner === 1,
            'bg-blue-100': board.winner === 2
        }"
    >
        <SmallCell 
            v-for="(cell, index) in board.board" 
            :key="index" 
            :token="valToToken(cell)"
            :disabled="!isPlayable || !!board.winner || cell !== 0"
            :highlight="lastMoveIndex === index"
            @cellClick="handleCellClick(board.index, index)"
        />

        <!-- Winner Overlay -->
        <div 
            v-if="board.winner" 
            class="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]"
        >
            <span 
                class="text-9xl font-black transform -rotate-12 drop-shadow-xl"
                :class="{
                    'text-red-600': board.winner === 1,
                    'text-blue-600': board.winner === 2
                }"
            >
                {{ valToToken(board.winner) }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import SmallCell from './SmallCell.vue';
import { computed } from 'vue';
import { useGameStore } from '../stores/gamemanager';
import { useGameSocket } from '../composables/useGameSocket';
import type { SmallBoardDto } from '~~/types/game';

const props = defineProps<{ board: SmallBoardDto, isAI?: boolean }>();
const gameStore = useGameStore();
const gameId = computed(() => gameStore.gameId);
const {requestAIMove, requestMove } = useGameSocket();
const lastMoveIndex = computed(() => {
    if (gameStore.lastMove?.boardId === props.board.index) {
        return gameStore.lastMove.index;
    }
    return -1;
});

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
    if (props.isAI) {
        requestAIMove(gameId.value, boardId, index, target, gameStore.playerId);
    } else {
        requestMove(gameId.value, boardId, index, target, gameStore.currentPlayer);
    }
}

</script>