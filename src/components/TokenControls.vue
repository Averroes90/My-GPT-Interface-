<template>
  <v-container
    class="d-flex ma-0 pa-0 justify-start align-start"
    style="position: absolute; top: 0; right: 1; z-index: 1"
  >
    <v-card
      width="110"
      class="d-flex align-center flex-column mr-1"
      color="blue-grey"
      height="80"
    >
      <p class="ma-0 pa-0 text-grey-darken-4">Max Comp</p>
      <v-text-field
        v-model.number="tokens"
        hide-spin-buttons
        type="number"
        placeholder="4096"
        density="compact"
        variant="solo-filled"
        class="mt-1 mx-2"
      ></v-text-field>
    </v-card>
    <v-card
      width="110"
      class="d-flex align-center flex-column mr-1"
      color="blue-grey"
      height="80"
    >
      <p class="ma-0 pa-0 text-grey-darken-4">Convo Tokens</p>
      <v-text-field
        v-model.number="totalTokens"
        hide-spin-buttons
        readonly
        type="number"
        density="compact"
        variant="solo-filled"
        class="mt-1 mx-2"
      ></v-text-field>
    </v-card>
    <v-card
      width="110"
      class="d-flex align-center flex-column mr-1 py-0"
      color="blue-grey"
      height="80"
    >
      <p class="ma-0 pa-0 text-grey-darken-4">Incl.Context</p>
      <v-text-field
        v-model.number="contextTokens"
        readonly
        type="number"
        hide-spin-buttons
        density="compact"
        variant="solo-filled"
        class="mt-1 mx-2"
      ></v-text-field>
    </v-card>
    <v-card
      width="110"
      class="d-flex align-center flex-column mr-1"
      color="blue-grey"
      height="80"
    >
      <p class="ma-0 pa-0 text-grey-darken-4">Remaining</p>
      <v-text-field
        v-model.number="remainingTokens"
        hide-spin-buttons
        type="number"
        placeholder="-"
        readonly
        density="compact"
        variant="solo-filled"
        class="mt-1 mx-2"
      ></v-text-field>
    </v-card>
    <v-card
      width="110"
      class="d-flex align-center flex-column"
      color="blue-grey"
      height="80"
    >
      <p class="ma-0 pa-0 text-grey-darken-4">Prompt</p>
      <v-text-field
        v-model.number="promptTokens"
        hide-spin-buttons
        type="number"
        readonly
        density="compact"
        variant="solo-filled"
        class="mt-1 mx-2"
      ></v-text-field>
    </v-card>
  </v-container>
</template>

<script setup>
import { computed, toRefs } from 'vue';

const props = defineProps({
  maxTokens: Number,
  contextTokens: Number,
  remainingTokens: Number,
  totalTokens: Number,
  promptTokens: Number,
});
const emit = defineEmits(['update:maxtokens']);
const tokens = computed({
  get: () => props.maxTokens,
  set: (newValue) => {
    emit('update:maxtokens', Number(newValue));
  },
});

const { contextTokens, remainingTokens, totalTokens, promptTokens } =
  toRefs(props);
</script>
