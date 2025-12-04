<template>
    <div class="min-h-screen flex flex-col items-center justify-center p-4 gap-6 bg-gray-50">

        <div class="w-full max-w-[min(90vh,90vw)] aspect-square relative">
            <TicTacToeBoard>
                <SmallBoard 
                    v-for="(board, index) in boardState.boards" 
                    :key="index" 
                    :board="board"
                    :isAI="isAI"
                />
            </TicTacToeBoard>

            <!-- Game Over Overlay -->
            <div 
                v-if="boardState.winner" 
                class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg animate-in fade-in duration-300"
            >
                <h2 class="text-6xl md:text-8xl font-black text-white mb-8 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-wider">
                    <span :class="boardState.winner === 1 ? 'text-red-500' : 'text-blue-500'">
                        {{ boardState.winner === 1 ? 'X' : 'O' }}
                    </span>
                    WINS!
                </h2>
                <Button 
                    size="lg" 
                    class="font-bold text-xl px-10 py-6 shadow-xl hover:scale-105 transition-transform"
                    @click="reset()"
                >
                    Play Again
                </Button>
            </div>
        </div>
        <div>

        <Button 
            v-if="!boardState.winner"
            size="lg" 
            class="font-bold text-lg px-8"
            @click="reset()"
        >
            New Game

        </Button>
        <Switch id="isAI" v-model="isAI" />
        <Label for="isAI">Play against AI</Label>
        <p v-if="isAI"> AI MODE ACTIVE</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import SmallBoard from '../components/SmallBoard.vue';
import TicTacToeBoard from '../components/TicTacToeBoard.vue';
import { useGameStore } from '../stores/gamemanager';
import { useGameSocket } from '../composables/useGameSocket';
import { Button } from '../components/ui/button';
import {Switch } from '../components/ui/switch';

const socket = useGameSocket();
const {requestReset} = socket;
const gameStore = useGameStore();
const {gameId} = storeToRefs(gameStore);
const {boardState} = storeToRefs(gameStore);
const isAI = ref(false);

function reset() {
    if (!gameId.value) return;
    requestReset(gameId.value);
}
</script>
