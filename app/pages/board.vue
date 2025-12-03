<template>
    <div class="board-page">
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

        <div class="board-container">
            <TicTacToeBoard>
                <SmallBoard 
                    v-for="(board, index) in boardState.boards" 
                    :key="index" 
                    :board="board"
                />
            </TicTacToeBoard>
        </div>
        <button class="new-game-btn" @click="boardStore.reset()">New Game</button>
    </div>
</template>

<script setup lang="ts">
import { useBoardStore } from '@/stores/board';
import { storeToRefs } from 'pinia';
import SmallBoard from '@/components/SmallBoard.vue';
import TicTacToeBoard from '@/components/TicTacToeBoard.vue';
import { useGameStore } from '@/stores/gamemanager';

const gameStore = useGameStore();
const url = 'ws://localhost:3000/api/gameSocket';
// const url = `ws://${location.host}/api/gameSocket`;
const {status, data, send, open, close} = useWebSocket(url);

// I feel like this handler should be in the store, but I'm not sure how to do that
// or maybe in a composable or something
watch(data, (newData) => {
    const message = JSON.parse(newData);
    if (message.type === 'moveConfirmed') {
        boardStore.syncBoardState(message.board, message.nextBoard, message.currentPlayer);
    }
    if (message.type ==='boardReset') {
        console.log("board reset")
        boardStore.syncBoardState(message.board, message.nextBoard, message.currentPlayer);
    }
    if (message.type === 'playerJoined') {
        boardStore.syncBoardState(message.board, message.nextBoard, message.currentPlayer);
        console.log(message.playerName + ' joined the game');
    }
    if (message.type === 'playerLeft') {
        console.log(message.playerName + ' left the game');
    }
    if (message.type === 'gameStarted') {
        boardStore.syncBoardState(message.board, message.nextBoard, message.currentPlayer);
        console.log('Game started');
    }
    if (message.type === 'gameOver') {
        console.log('Game over');
    }

})

onMounted(() => {
    gameStore.connect();
    // gamestore connect should handle this, but for now let's manually do it here


});


const gameId = ref('');
const playerName = ref('');

const boardStore = useBoardStore();
const { boardState } = storeToRefs(boardStore);
// boardStore.initializeBoard();

function joinGame() {
    gameStore.joinGame(gameId.value, playerName.value);
    send(JSON.stringify({ type: 'join', gameId: gameId.value, playerName: playerName.value }));
    boardStore.setGameId(gameId.value);
    boardStore.setPlayerName(playerName.value);
}

function createGame() {
    gameStore.createGame(gameId.value, playerName.value);
    const resp = send(JSON.stringify({ type: 'create', gameId: gameId.value, playerName: playerName.value }));
    console.log(resp);
    boardStore.setGameId(gameId.value);
    boardStore.setPlayerName(playerName.value);
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