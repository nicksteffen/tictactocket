<template>
    <div>
        <Game v-if="gameId" />
        <Lobby v-else />
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import {useGameStore} from '../stores/gamemanager';
import Lobby from '../components/Lobby.vue';
import Game from '../components/Game.vue';
import { useGameSocket } from '../composables/useGameSocket';

const gameStore = useGameStore();
const { gameId } = storeToRefs(gameStore);

// Initialize socket here to ensure the watcher persists across component swaps
useGameSocket();
</script>
