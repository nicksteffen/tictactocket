<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card class="w-full max-w-md p-6 space-y-6">
            <div class="space-y-2 text-center">
                <h1 class="text-3xl font-bold">TicTacTocket</h1>
                <p class="text-gray-500">Enter your name and a game ID to play</p>
            </div>

            <div class="space-y-4">
                <div class="space-y-2">
                    <Label for="playerName">Player Name</Label>
                    <Input 
                        id="playerName"
                        v-model="playerName" 
                        placeholder="Enter your name" 
                    />
                </div>

                <div class="space-y-2">
                    <Label for="gameId">Game ID</Label>
                    <Input 
                        id="gameId"
                        v-model="gameId" 
                        placeholder="Enter game room ID" 
                    />
                </div>

                <div class="grid grid-cols-2 gap-4 pt-2">
                    <Button 
                        @click="joinGame" 
                        :disabled="!isValid"
                        variant="outline"
                        class="w-full"
                    >
                        Join Game
                    </Button>
                    <Button 
                        @click="createGame" 
                        :disabled="!isValid"
                        class="w-full"
                    >
                        Create Game
                    </Button>
                </div>
                <div class="pt-2">
                    <Button 
                        @click="createAIGame" 
                        :disabled="!isValid"
                        class="w-full"
                    >
                        Create AI Game
                    </Button>
                </div>
            </div>
        </Card>
    </div>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGameStore } from '../stores/gamemanager';
import { useGameSocket } from '../composables/useGameSocket';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';



const playerName = ref('');
const gameId = ref('');

const gameStore = useGameStore();
const socket = useGameSocket();
const { requestJoinGame, requestCreateGame } = socket;

const isValid = computed(() => {
    return playerName.value.trim().length > 0 && gameId.value.trim().length > 0;
});

function joinGame() {
    if (!isValid.value) return;
    // gameStore.joinGame(gameId.value, playerName.value);
    requestJoinGame(gameId.value, playerName.value);
    // gameStore.boardState = gameStore.boardState;
    // gameStore.playerName = playerName.value;
}

function createGame() {
    if (!isValid.value) return;
    requestCreateGame(gameId.value, playerName.value);
}

function createAIGame() {
    if (!isValid.value) return;
    gameStore.isAI = true;
    requestCreateGame(gameId.value, playerName.value);
}
</script>

    