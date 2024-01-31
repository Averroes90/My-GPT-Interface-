<template>
    <v-container class="d-flex ma-0 pa-0 justify-start align-start" 
    style="position: absolute; top: 0; right: 1; z-index: 1;">
        <v-card
        width="110"
        class="d-flex align-center flex-column mr-1"
        color="blue-grey"
        height="80">
        <p class="ma-0 pa-0 text-grey-darken-4">Max Comp</p>
            <v-text-field
            hide-spin-buttons
            type="number"
            placeholder="4096"
            density="compact"
            variant="solo-filled"
            class= "mt-1 mx-2"
            v-model.number="tokens"
            ></v-text-field>
        </v-card>
        <v-card
        width="110"
        class="d-flex align-center flex-column mr-1"
        color="blue-grey"
        height="80">
        <p class="ma-0 pa-0 text-grey-darken-4">Convo Tokens</p>
            <v-text-field
            hide-spin-buttons
            readonly
            type="number"
            density="compact"
            variant="solo-filled"
            class= "mt-1 mx-2"
            v-model.number="total_tokens"
            ></v-text-field>
        </v-card>
        <v-card
        width="110"
        class="d-flex align-center flex-column mr-1 py-0"
        color="blue-grey"
        height="80">
        <p class="ma-0 pa-0 text-grey-darken-4">Incl.Context</p>
            <v-text-field
            readonly
            type="number"
            hide-spin-buttons
            density="compact"
            variant="solo-filled"
            class= "mt-1 mx-2" 
            v-model.number="context_tokens"
            ></v-text-field>
        </v-card>
        <v-card
        width="110"
        class="d-flex align-center flex-column mr-1"
        color="blue-grey"
        height="80">
        <p class="ma-0 pa-0 text-grey-darken-4">Remaining</p>
            <v-text-field
            hide-spin-buttons
            type="number"
            placeholder="-"
            readonly
            density="compact"
            variant="solo-filled"
            class= "mt-1 mx-2"
            v-model.number="remaining_tokens"
            ></v-text-field>
        </v-card>
        <v-card
        width="110"
        class="d-flex align-center flex-column "
        color="blue-grey"
        height="80">
        <p class="ma-0 pa-0 text-grey-darken-4">Prompt</p>
            <v-text-field
            hide-spin-buttons
            type="number"
            readonly
            density="compact"
            variant="solo-filled"
            class= "mt-1 mx-2"
            v-model.number="prompt_tokens"
            ></v-text-field>
        </v-card>
    </v-container>
</template>
<script setup>
import {computed, toRefs } from 'vue';

const props = defineProps({ maxtokens: Number,
                            context_tokens: Number,
                            remaining_tokens: Number,
                            total_tokens: Number,
                            prompt_tokens: Number });
const emit = defineEmits(['update:value']);
const tokens = computed({
  get: () => props.maxtokens,
  set: (newValue) => {
    emit('update:value', newValue);
  }
});

const { context_tokens, 
        remaining_tokens, 
        total_tokens, 
        prompt_tokens } = toRefs(props);
        
</script>

