<template>
    <v-container fluid class="fill-height">
      <!-- Child Components -->
      <ChatWindow @update:selectedInteractions="updateSelectedInteractions" 
        :uniqueId="uniqueId"/>
            <v-row 
              justify="start"
              class="d-flex">
                <v-col cols=5 class="d-flex pb-0">
                  <PromptArea v-model="promptContent"
                    @sendprompt="sendPrompt"/>
                </v-col>
                <v-col cols=4 class="pb-0" >
                  <v-row class="mb-0" >
                    <v-col cols="1" >
                      <v-checkbox-btn density ="comfortable" class="ma-0 pa-0"
                        v-model="newConversationCheckboxState"
                        :disabled="!hasConversations"
                        hide-details>
                      </v-checkbox-btn> 
                    </v-col>
                    <v-col class="pr-0">
                      <v-text-field class="ml-5" clearable label="New Conversation Title" 
                      v-model= "newConversationTitle"
                      :disabled="!newConversationCheckboxState" 
                      ></v-text-field>
                    </v-col> 
                  </v-row> 
                  <v-row > 
                    <ConversationDropdown
                      :items="conversationTitles" 
                      :selected="selectedConversation" 
                      :disabled="newConversationCheckboxState"
                      v-model="selectedConversation"/>       
                  </v-row>
                </v-col>
            </v-row>    
     </v-container>
</template>

<script setup>

import { ref, computed, onMounted, onBeforeMount, watch, defineEmits } from 'vue';
import { useStore } from 'vuex'; // Import Vuex store
import ChatWindow from './ChatWindow.vue'
import * as api from '../api.js';
import { createChatWindowModule } from '../chatBoxDynamicModule.js';
import ConversationDropdown from './ConversationDropdown.vue';
import PromptArea from './PromptArea.vue';

const emit = defineEmits(); 
const newConversationCheckboxState = ref(false); // Initialize a ref for newConversationCheckboxState
//const conversationTitles = ref([]);
const selectedInteractions = ref([]); // Keep a state in the parent too
//const selectedConversation = ref(null); // Initialize a ref for selectedConversation
const newConversationTitle = ref(''); // Initialize a ref for newConversationTitle
//const hasConversations = ref(true); 
const uniqueId = ref("WindowMain"); //associated chatwindow
const promptContent = ref('');
// Initialize store
const store = useStore();

store.registerModule(`chat_${uniqueId.value}`, createChatWindowModule(uniqueId.value));
store.commit('ADD_CHAT_WINDOW_ID', uniqueId.value);

//const deletionMode = computed(() => store.state.deletionMode)
const hasConversations = computed(() => store.state[`chat_${uniqueId.value}`].has_conversations);
const conversationTitles = computed(() => store.state[`chat_${uniqueId.value}`].conversationTitlelist);


const selectedConversation = computed({
  get: () => store.state[`chat_${uniqueId.value}`].selectedConversationId,
  set: (newValue) => store.commit(`chat_${uniqueId.value}/setSelectedConversationId`, newValue)
});

watch(selectedConversation, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    emit('update:selectedConversation', selectedConversation);
    if (newConversationCheckboxState.value) {
      newConversationCheckboxState.value = false; // Uncheck the checkbox
    }
    await store.dispatch(`chat_${uniqueId.value}/refreshChatWindow`);

  }
});


const updateSelectedInteractions = (newSelectedInteractions) => {
  emit('update:selectedInteractions', newSelectedInteractions);
};

async function sendPrompt() {
    // Validation checks similar to your existing code
    if (!checkUserEntries()) {
        return; // Stop the function here if there was an error
    }
    // Your hardcoded values
    const modelName = "gpt-4-1106-preview";  
    const tokenLimit = 128000;
    const tokenReserve = 4096;
    const payload = {
        userPrompt: promptContent.value,
        newConversationCheckbox: newConversationCheckboxState.value,
        newConversationTitle: newConversationTitle.value,
        existingConversationTitle: selectedConversation.value,
        tokenLimit,
        tokenReserve,
        modelName
    };
  
    // Dispatch the Vuex action
    store.dispatch(`chat_${uniqueId.value}/sendPrompt`, payload).then(() => {
      // Clear the user prompt once the action is complete
      promptContent.value = ""; // Clear the user prompt area
      newConversationTitle.value=""; //clear newconversation title 
    }).catch((error) => {
      console.error("An error occurred while dispatching the prompt:", error);
    });
  };
  function checkUserEntries() {
    //const newConversationCheckbox = newConversationCheckbox.value;
    const trimmednewConversationTitle = newConversationCheckboxState.value ? newConversationTitle.value.trim() : '';

    // Check if the user opted to create a new conversation but left the conversation title box empty
    if (newConversationCheckboxState.value && trimmednewConversationTitle === '') {
        // Dispatch an action to your Vuex store to handle the error
        console.log('New Conversation Title cannot be empty when "New Conversation" is checked.');
        store.commit('ADD_NOTIFICATION', { message: 'New Conversation Title cannot be empty when "New Conversation" is checked.', type: 'error-message' });
        return false; // Return false to indicate an error
    }
    
    return true; // Return true to indicate that everything is okay
  }


onMounted(async () => {
  await store.dispatch(`chat_${uniqueId.value}/populateConversationTitleList`);
});

</script>
