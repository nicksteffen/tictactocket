<template>
    <div v-if="props.isOpen">
    <span>Player Name: </span><p> {{gameStore.playerName}}</p>
    <span>Player ID: </span><p> {{gameStore.playerId}}</p>
    <span>Game ID: </span><p> {{gameStore.gameId}}</p>
    <span>Current Player: </span><p> {{gameStore.currentPlayer}}</p>
    <span>Next Board: </span><p> {{gameStore.nextBoard}}</p>
    <span>Board State: </span><p> {{gameStore.boardState}}</p>
    <span>Alerts: </span><p> {{gameStore.alerts}}</p>
    <span>Is AI: </span><p> {{gameStore.isAI}}</p>
    <span>Last Move: </span><p> {{gameStore.lastMove}}</p>
        
        
    </div>
    
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/gamemanager';

const gameStore = useGameStore();
const props = defineProps<{ 
    isOpen: boolean
}>();

</script>