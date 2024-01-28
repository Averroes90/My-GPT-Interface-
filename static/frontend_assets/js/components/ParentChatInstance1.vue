<template>
     <v-container fluid class= "ma-0 pa-0">
      <!-- Child Components -->
          <TokenControls
          :maxtokens="maxtokens"
          :context_tokens="context_tokens"
          :remaining_tokens="remaining_tokens"
          :total_tokens="total_tokens"
          :prompt_tokens ="promptContentTokenCount"
          @update:value="updateTokens"/>
            <v-row fluid class="d-flex overflow-y-auto mt-15 mb-10" 
              ref="messagesContainer" style="height: 75vh;">
                  <ChatWindow @update:selectedInteractions="updateSelectedInteractions" 
                    :uniqueId="uniqueId"/>
            </v-row>
            <v-row>
                <v-col cols=5 class="pb-0">
                  <PromptArea v-model="promptContent"
                    @sendprompt="sendPrompt"/>
                </v-col>
                <v-col cols=4>
                  <v-row class="justify-start align-start" >
                    <v-col cols="1" >
                      <v-checkbox-btn density ="compact" 
                        v-model="newConversationCheckboxState"
                        :disabled="!hasConversations"
                        hide-details/>
                    </v-col>
                    <v-col class="pr-0">
                      <v-text-field  clearable label="New Conversation Title" 
                      v-model= "newConversationTitle"
                      :disabled="!newConversationCheckboxState" 
                      ></v-text-field>
                    </v-col> 
                  </v-row> 
                  <v-row class="d-flex align-end justify-end"> 
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

import { ref, computed, onMounted, onBeforeMount, watch, defineEmits, nextTick } from 'vue';
import { useStore } from 'vuex'; // Import Vuex store
import ChatWindow from './ChatWindow.vue'
import * as api from '../api.js';
import { createChatWindowModule } from '../chatWindowDynamicModule.js';
import ConversationDropdown from './ConversationDropdown.vue';
import PromptArea from './PromptArea.vue';
import TokenControls from './TokenControls.vue'
import { useTokenCounter } from '../composables/useTokenCounter';
import PopInteractionsButton from './PopInteractionsButton.vue';
const emit = defineEmits(); 
const newConversationCheckboxState = ref(false); // Initialize a ref for newConversationCheckboxState
const selectedInteractions = ref([]); // Keep a state in the parent too
const newConversationTitle = ref(''); // Initialize a ref for newConversationTitle
const uniqueId = ref("WindowMain"); //associated chatwindow
const promptContent = ref('');
const interactions = computed(() => store.state[`chat_${uniqueId.value}`].interactions);
const selectMode = computed(() => store.state.selectMode);
const context_tokens = computed(() => store.state[`chat_${uniqueId.value}`].contextTokens);
const total_tokens = computed(() => store.state[`chat_${uniqueId.value}`].totalTokens);

const messagesContainer = ref(null);
// Initialize store
const store = useStore();
const mintokens = 1;
const maxAllowedTokens =4096;
const maxtokens = ref(4096);
const modelName = "gpt-4-turbo-preview";  
const tokenLimit = 128000;
const { promptContentTokenCount } = useTokenCounter(promptContent);

const remaining_tokens = computed(() => {
  return tokenLimit - context_tokens.value
})

store.registerModule(`chat_${uniqueId.value}`, createChatWindowModule(uniqueId.value));
store.commit('ADD_CHAT_WINDOW', { id: uniqueId.value, modelType: modelName });

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
    await store.dispatch(`chat_${uniqueId.value}/refreshChatWindow`,{ modelName });

  }
});


const updateSelectedInteractions = (newSelectedInteractions) => {
  emit('update:selectedInteractions', newSelectedInteractions);
};
function updateTokens(newValue) {
maxtokens.value = parseInt(newValue,10) 

};
async function sendPrompt() {
    // Validation checks similar to your existing code
    if (!checkUserEntries()) {
        return; // Stop the function here if there was an error
    }
    // Your hardcoded values
    const tokenReserve = maxtokens.value;
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
    const trimmednewConversationTitle = newConversationCheckboxState.value ? newConversationTitle.value.trim() : '';

    // Check if the user opted to create a new conversation but left the conversation title box empty
    if (newConversationCheckboxState.value && trimmednewConversationTitle === '') {
        // Dispatch an action to your Vuex store to handle the error
        console.log('New Conversation Title cannot be empty when "New Conversation" is checked.');
        store.commit('ADD_NOTIFICATION', { message: 'New Conversation Title cannot be empty when "New Conversation" is checked.', type: 'error-message' });
        return false; // Return false to indicate an error
    }
    // Validate maxtokens as a string with only digits and optional leading/trailing spaces
    if (!/^\s*\d+\s*$/.test(maxtokens.value)) {
        store.commit('ADD_NOTIFICATION', {
            message: `Max tokens must be a whole number without letters or special characters.`,
            type: 'error-message'
        });
        return false;
    }

    // If the regular expression test passes, parse the value, which is known to be numeric
    const maxTokensValue = parseInt(maxtokens.value, 10);

    // Validate the numeric range of maxTokensValue
    if (isNaN(maxTokensValue) || maxTokensValue < mintokens || maxTokensValue > maxAllowedTokens) {
        const errorMessage = `Max tokens must be an integer between ${mintokens} and ${maxAllowedTokens}.`;
        store.commit('ADD_NOTIFICATION', {
            message: errorMessage,
            type: 'error-message'
        });
        return false;
    }
    
    return true; // Return true to indicate that everything is okay
  }

// Watch for changes in interactions
watch(interactions, (newInteractions, oldInteractions) => {
  // Using nextTick to ensure the DOM is updated before attempting to scroll
  nextTick(() => {
    scrollToBottom();
  });
}, { deep: true });

watch(selectMode, (newdel, olddel) => {
  // Using nextTick to ensure the DOM is updated before attempting to scroll
  nextTick(() => {
    scrollToBottom();
  });
}, { deep: true });


const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};
onMounted(async () => {
  await store.dispatch(`chat_${uniqueId.value}/populateConversationTitleList`);
});

</script>
