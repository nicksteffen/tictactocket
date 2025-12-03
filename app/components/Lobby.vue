<template>
    <div>
        <input 
            v-model="playerName"
            placeholder="Player Name"
        />
        <input
            v-model="gameId"
            placeholder="Game ID"
        />
        <button @click="joinGame">Join Game</button>
        <button @click="createGame">Create Game</button>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';

const playerName = ref('');
const gameId = ref('');

const gameStore = useGameStore();
const socket = useGameSocket();
const { requestJoinGame, requestCreateGame } = socket;


function joinGame() {
    gameStore.joinGame(gameId.value, playerName.value);
    requestJoinGame(gameId.value, playerName.value);
    // all of this should be in the syncBoardState?
    gameStore.boardState = gameStore.boardState;
    gameStore.playerName = playerName.value;
}

function createGame() {
    gameStore.createGame(gameId.value, playerName.value);
    requestCreateGame(gameId.value, playerName.value);
    // all of this should be in the syncBoardState?
    gameStore.boardState = gameStore.boardState;
    gameStore.playerName = playerName.value;
}
</script>

    