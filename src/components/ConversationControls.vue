<template>
  <v-row>
    <v-divider></v-divider>
    <v-col cols="5" class="pb-0">
      <PromptArea
        v-model:new-conversation-title="newConversationTitle"
        :newConversationCheckbox="newConversationCheckboxState"
        :selectedConversation="selectedConversation"
        :modelName="modelName"
        :windowId="uniqueId"
        :maxResponseTokens="maxResponseTokens"
      />
    </v-col>
    <v-col cols="4" class="pb-0">
      <v-row class="justify-start align-start">
        <v-col cols="1">
          <v-checkbox-btn
            v-model="newConversationCheckboxState"
            density="compact"
            :disabled="!hasConversations"
            hide-details
          />
        </v-col>
        <v-col class="pr-0">
          <v-text-field
            v-model="newConversationTitle"
            clearable
            label="New Conversation Title"
            :disabled="!newConversationCheckboxState"
            variant="outlined"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="align-center">
        <v-col cols="3">
          <v-text-field
            hide-spin-buttons
            type="number"
            v-model.number="maxResponseTokens"
            placeholder="4096"
            density="compact"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="9" class="pt-0">
          <v-select
            v-model="selectedConversation"
            :items="conversationTitles"
            :disabled="newConversationCheckboxState"
            item-title="name"
            item-value="id"
            variant="outlined"
          ></v-select>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script setup>
import { ref, computed, watch, toRefs } from 'vue';
import { useStore } from 'vuex'; // Import Vuex store
import PromptArea from './PromptArea.vue';

const props = defineProps({
  uniqueId: {
    type: String,
    required: true,
  },
  modelName: {
    type: String,
    required: true,
  },
  newConversationTitle: {
    type: String,
    default: '',
  },
  newConversationCheckboxState: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:newConversationTitle','update:newConversationCheckboxState']);

const { uniqueId, modelName } = toRefs(props);
const maxResponseTokens = ref(4096);
const newConversationTitle = computed({
  get: () => props.newConversationTitle,
  set: (newValue) => {
    emit('update:newConversationTitle', newValue);
  },
});
const newConversationCheckboxState = computed({
  get: () => props.newConversationCheckboxState,
  set: (newValue) => {
    emit('update:newConversationCheckboxState', newValue);
  },
});
// Initialize store
const store = useStore();

const hasConversations = computed(() => {
  const chatWindow = store.state.chatWindows[uniqueId.value];
  return chatWindow ? chatWindow.has_conversations : false;
});
const conversationTitles = computed(() => {
  const chatWindow = store.state.chatWindows[uniqueId.value];
  return chatWindow ? chatWindow.conversationTitleList : [];
});

const selectedConversation = computed({
  get() {
    // Accessing the selected conversation ID from the specific chat window
    const chatWindow = store.state.chatWindows[uniqueId.value];
    return chatWindow ? chatWindow.selectedConversationId : null;
  },
  set(newValue) {
    // Committing a mutation to update the selected conversation ID
    // for the specific chat window
    store.commit('ADD_ATTRIBUTE_TO_CHAT_WINDOW', {
      windowId: uniqueId.value,
      attributeName: 'selectedConversationId',
      attributeValue: newValue,
    });
  },
});

const refreshChatWindow = async (newConversationId) => {
  if (newConversationCheckboxState.value) {
    newConversationCheckboxState.value = false; // Uncheck the checkbox
    newConversationTitle.value = ''; // Clear new conversation title
  }
  await store.dispatch(`chat_${uniqueId.value}/refreshChatWindow`, {
    selectedConversationId: newConversationId,
    modelName: modelName.value,
  });
};

watch(selectedConversation, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    await refreshChatWindow(newVal);
  }
});

</script>
