<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/stores/gamemanager'; 

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'; 

const gameStore = useGameStore();
const { alerts } = storeToRefs(gameStore);


const currentAlert = computed(() => alerts.value[0]);
const isOpen = computed(() => !!currentAlert.value);

const handleClose = () => {
    gameStore.removeFirstAlert();
};

// Helper to determine the title based on the alert type
const titleText = computed(() => {
  if (!currentAlert.value) return '';
  switch (currentAlert.value.type) {
    case 'error': return 'Error';
    case 'warning': return 'Warning';
    case 'info': return 'Information';
    default: return 'Notification';
  }
});
</script>

<template>
  <!-- <div v-if="currentAlert"> -->
    <AlertDialog :open="isOpen" :modal="true">
      <AlertDialogContent class="w-[425px] bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle :class="{'text-red-600': currentAlert?.type === 'error'}">
            {{ titleText }}
          </AlertDialogTitle>
          
          <AlertDialogDescription :class="{'text-red-600': currentAlert?.type === 'error'}">
            {{ currentAlert?.message }}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div v-if="currentAlert?.details" class="mt-4 p-3 bg-gray-50 border rounded-md text-sm text-gray-700">
            <details>
                <summary class="font-medium cursor-pointer">Technical Details</summary>
                <pre class="mt-1 whitespace-pre-wrap font-mono text-xs">{{ currentAlert?.details }}</pre>
            </details>
        </div>

        <AlertDialogFooter>
          <AlertDialogAction @click="handleClose">
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  <!-- </div> -->
</template>