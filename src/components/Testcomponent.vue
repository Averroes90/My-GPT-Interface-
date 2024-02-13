<!-- PromptArea.vue -->
<template>
  <div class="textarea-container" ref="containerRef">
    <v-textarea
      v-model="internalPromptContent"
      clearable
      placeholder="Enter your prompt here"
      appendInner-icon="mdi-send"
      no-resize
      @click:append-inner="sendPrompt"
      @keydown.enter="!$event.shiftKey && sendPrompt()"
      ref="textareaRef"
      :counter="100"
      :counter-value="customCounter"
    ></v-textarea>
    <v-overlay
      v-model="menuVisible"
      :attach="containerRef"
      contained
      persistent
      no-click-animation
      :scrim="false"
      z-index="1"
      scroll-strategy="none"
      location-strategy="connected"
      location="end bottom"
      :target="textareaRef"
      offset="-35"
      appendInner-icon="mdi-send"
    >
      <v-icon icon="mdi-send" class="mb-2"></v-icon>
    </v-overlay>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  promptContent: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['sendprompt', 'update:promptContent']);

const menuVisible = ref(true); // Keep the menu always visible
const attachSelector = '.v-text-area__slot'; // Attach to the slot within the v-textarea
const textareaRef = ref(null);
const containerRef = ref(null);

const internalPromptContent = computed({
  get: () => props.promptContent,
  set: (newValue) => {
    emit('update:promptContent', newValue);
  },
});

function customCounter(value) {
  // Replace this logic with your token counting function
  return value.split(/\s+/).length; // counts the number of words/tokens
}

const sendPrompt = () => {
  emit('sendprompt');
};
</script>
<style scoped>
.textarea-container {
  position: relative; /* Establish a positioning context for the overlay */
}

.custom-append-icon-position .v-input__append-inner {
  position: absolute;
  bottom: 0;
}
.custom-append-icon-position .v-textarea__details {
  margin-top: 24px;
}
</style>
