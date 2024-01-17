<template>
    <v-container class="d-flex ma-0 pa-0 justify-start align-start" 
    style="position: absolute; top: 0; right: 1; z-index: 1;">
        <v-card
        width="90"
        class="d-flex align-center flex-column mr-1"
        color="blue-grey"
        height="80">
        <p class="ma-0 pa-0 text-grey-darken-4">Max Comp</p>
            <v-text-field
            density="compact"
            variant="solo-filled"
            class= "mt-1"
            v-model.number="tokens"
            ></v-text-field>
        </v-card>
        <v-card
        width="90"
        class="d-flex align-center flex-column mr-1"
        color="blue-grey"
        height="80">
        <p class="ma-0 pa-0 text-grey-darken-4">Context</p>
            <v-text-field
            :disabled="true"
            density="compact"
            variant="solo-filled"
            class= "mt-1"
            ></v-text-field>
        </v-card>
        <v-card
        width="90"
        class="d-flex align-center flex-column mr-1"
        color="blue-grey"
        height="80">
        <p class="ma-0 pa-0 text-grey-darken-4">Remaining</p>
            <v-text-field
            :disabled="true"
            density="compact"
            variant="solo-filled"
            class= "mt-1"
            ></v-text-field>
        </v-card>
        <v-card
        width="90"
        class="d-flex align-center flex-column "
        color="blue-grey"
        height="80">
        <p class="ma-0 pa-0 text-grey-darken-4">Prompt</p>
            <v-text-field
            :disabled="true"
            density="compact"
            variant="solo-filled"
            class= "mt-1"
            ></v-text-field>
        </v-card>
    </v-container>
</template>
<script setup>
import { ref, toRef, watch, computed } from 'vue';

const props = defineProps({ maxtokens: Number });
const emit = defineEmits(['update:value']);
const tokens = computed({
  get: () => props.maxtokens,
  set: (newValue) => {
    emit('update:value', newValue);
  }
});



</script>

