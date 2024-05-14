<!-- PromptArea.vue -->
<template>
  <v-textarea
    v-model="promptContent"
    clearable
    placeholder="Enter your prompt here"
    append-inner-icon="mdi-send"
    no-resize
    :counter="promptTokenLimit"
    :counter-value="customCounter"
    :rules="rules"
    variant="outlined"
    @click:append-inner="sendPrompt"
    @keydown.enter="!$event.shiftKey && sendPrompt()"
  ></v-textarea>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import { useStore } from 'vuex'; // Import Vuex store
import { useTokenCounter } from '@/composables/useTokenCounter';
import {
  useConversationValidation,
  useTokenValidation,
} from '@/composables/useCustomValidations';
const props = defineProps({
  newConversationTitle: {
    type: String,
    default: '',
  },
  newConversationCheckbox: {
    type: Boolean,
    default: false,
  },
  selectedConversation: {
    type: String,
    default: '',
  },
  modelName: {
    type: String,
    required: true,
  },
  windowId: {
    type: String,
    required: true,
  },
  maxResponseTokens: {
    type: Number,
    default: 1000,
  },
});
const emit = defineEmits(['update:newConversationTitle']);
const promptContent = ref('');
const { promptContentTokenCount } = useTokenCounter(promptContent);
const {
  newConversationTitle,
  newConversationCheckbox,
  selectedConversation,
  modelName,
  windowId,
  maxResponseTokens,
} = toRefs(props);
const promptTokenLimit = ref(4096);
const tokenLimit = 128000;
const mintokens = 1;
const rules = [
  () =>
    promptContentTokenCount.value <= promptTokenLimit.value ||
    `max ${promptTokenLimit.value} tokens`,
];
const store = useStore();

function customCounter() {
  return promptContentTokenCount.value;
}

const { isValidNewConversation } = useConversationValidation(
  newConversationCheckbox,
  newConversationTitle
);
const { isValidToken } = useTokenValidation(
  promptTokenLimit,
  mintokens,
  promptTokenLimit
);

async function sendPrompt() {
  // Validation checks similar to your existing code
  if (!checkUserEntries()) {
    return; // Stop the function here if there was an error
  }
  // Your hardcoded values
  const tokenReserve = maxResponseTokens.value;
  const payload = {
    userPrompt: promptContent.value,
    newConversationCheckbox: newConversationCheckbox.value,
    newConversationTitle: newConversationTitle.value,
    conversationSessionId: selectedConversation.value,
    tokenLimit,
    tokenReserve,
    modelName: modelName.value,
    windowId: windowId.value,
  };

  // Dispatch the Vuex action
  store
    .dispatch(`chat_${windowId.value}/sendPrompt`, payload)
    .then(() => {
      // Clear the user prompt once the action is complete
      emit('update:newConversationTitle', ''); //clear newconversation title
      promptContent.value = '';
    })
    .catch((error) => {
      console.error('An error occurred while dispatching the prompt:', error);
    });
}

function checkUserEntries() {
  if (!isValidNewConversation() || !isValidToken()) {
    return false;
  }
  return true;
}
</script>
