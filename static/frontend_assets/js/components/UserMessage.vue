<template>
  <v-col class="user-message" :cols="deletionMode ? '11' : '12'">
    You: {{ message }}
  </v-col>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  message: String
});

const store = useStore();
const deletionMode = computed(() => store.state.deletionMode);
</script>