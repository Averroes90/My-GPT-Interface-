<template>
  <v-container fluid class="ma-0 pa-0">
    <!-- Child Components -->
    <v-row fluid>
      <ChatWindow
        :unique-id="windowIdRef"
        :model-name="modelNameRef"
        :new-conversation-checkbox-state="newConversationCheckboxState"
        :new-conversation-title="newConversationTitle"
        @update:selected-interactions="updateSelectedInteractions"
        @model-name-updated="handleModelNameUpdated"
      />
    </v-row>
    <ConversationControls
      v-model:new-conversation-title="newConversationTitle"
      v-model:new-conversation-checkbox-state="newConversationCheckboxState"
      :unique-id="windowIdRef"
      :model-name="modelNameRef"
    />
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import ChatWindow from './ChatWindow.vue';
import ConversationControls from './ConversationControls.vue';

const emit = defineEmits(['update:selectedInteractions']);

const windowIdRef = ref('WindowMain'); //associated chatwindow
const newConversationTitle = ref('');
const newConversationCheckboxState = ref(false);

const modelNameRef = ref('gpt-4o');

const updateSelectedInteractions = (newSelectedInteractions) => {
  emit('update:selectedInteractions', newSelectedInteractions);
};

function handleModelNameUpdated(newModelName) {
modelNameRef.value = newModelName;
}
</script>
