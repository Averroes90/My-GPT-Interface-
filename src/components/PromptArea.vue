<!-- PromptArea.vue -->
<template>
  <v-textarea
    clearable
    placeholder="Enter your prompt here"
    append-inner-icon="mdi-send"
    hide-details
    @click:append-inner="sendPrompt"
    @keydown.enter="!$event.shiftKey && sendPrompt()"
  ></v-textarea>
</template>

<script setup>
const emit = defineEmits(['sendprompt']);
const sendPrompt = () => {
  emit('sendprompt');
};
</script>
