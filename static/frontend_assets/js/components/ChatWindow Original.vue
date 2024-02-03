<template>
    <v-container fluid class ="ma-0 pa-0">
      <v-row class="d-flex flex-column ma-0 pa-0 fill-height">
        <v-col v-for="(interaction, index) in interactions" 
        :key="interaction.interaction_session_id" 
        cols="auto">
          <div>User tokens: {{ interaction.prompt_tokens }}</div>
          <!-- Displaying AI tokens -->
          <div>AI tokens: {{ interaction.response_tokens }}</div>
        <v-card 
         :color="selectMode && selectedInteractions.includes(interaction.interaction_session_id) ? 'grey-darken-1' : ''" 
          flat tile class="ma-0 pa-0">
          <v-row class="align-start ml-0 pl-0 fill-height">
            <!-- Conditional checkbox for select mode -->
            <v-col class="mr-n15" v-if="selectMode" cols="1">
              <v-checkbox-btn class="mr-0 pr-0 gr-0" color="red" 
              @change="toggleSelection(interaction.interaction_session_id)"
              :input-value="selectedInteractions.includes(interaction.interaction_session_id)"
              density="compact"/>
            </v-col>
            <v-col :cols="selectMode ? '11' : '12'">
            <!-- User Message -->
            <UserMessage 
            :message="interaction.prompt" 
            :segments="interaction.segments"/>
            <!-- AI Message -->
            <AIMessage :response="interaction.response" />
            </v-col>
          </v-row>
        </v-card>
        </v-col>
          <PopInteractionsButton @pop:selectedInteractions="popSelectedInteractions"/>
      </v-row>
    </v-container>
</template>

<script setup>
import { computed, ref, defineProps, defineEmits, toRefs, watch } from 'vue'
import { useStore } from 'vuex';
import UserMessage from './UserMessage.vue';
import AIMessage from './AIMessage.vue';
import PopInteractionsButton from './PopInteractionsButton.vue';
import { useNotifications } from '../composables/useNotifications';

const props = defineProps({ uniqueId: String,
                            newConversationCheckboxState: Boolean,
                            newConversationTitle: String });
const emit = defineEmits(['update:selectedInteractions']);
const store = useStore();
const {uniqueId, newConversationCheckboxState, newConversationTitle } = toRefs(props, 'uniqueId');
// const uniqueId = ref("WindowMain"); //associated chatwindow
const selectMode = computed(() => store.state.selectMode);
const interactions = computed(() => store.state[`chat_${uniqueId.value}`].interactions);
const selectedInteractions = ref([]);
const { addNotification } = useNotifications();

const toggleSelection = (id) => {
  const index = selectedInteractions.value.indexOf(id);
  if (index > -1) {
    selectedInteractions.value.splice(index, 1); // Deselect
  } else {
    selectedInteractions.value.push(id); // Select
  }
  emit('update:selectedInteractions', selectedInteractions.value);
};

const popSelectedInteractions = () => {
  const trimmedTitle = newConversationCheckboxState.value ? newConversationTitle.value.trim() : '';
  if (!newConversationCheckboxState.value || trimmedTitle === '' ){
    const errorMessage = 'Please enter a title for the new conversation'
    addNotification(errorMessage, 'error-message');
    return;
  }
  const userConfirmed = window.confirm("Are you sure you want to pop selected interactions to a new conversation?");
  if (userConfirmed) {
    const payload = {
      ids: selectedInteractions.value,
      newConversationTitle: newConversationTitle.value
    }
    store.dispatch('popSelectedInteractions', payload);
    selectedInteractions.value = []; // Clear the selected items
  }
};

watch(selectMode, (newVal) => {
  if (newVal === false) {
    selectedInteractions.value = [];
  }
});


// onBeforeUnmount(() => {
//   console.log('on beforemount');
//   store.unregisterModule(`chat_${uniqueId.value}`);
//   store.commit('REMOVE_CHAT_WINDOW_ID', uniqueId.value);
// });
</script>
<style>
.ai-message {
  color: #85c1e9;  /* This is a light blue shade which complements the existing dark theme */
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: bold;
}
h1 { font-size: 2em; }
h2 { font-size: 1.75em; }
h3 { font-size: 1.5em; }
/* Continue for h4, h5, h6 as needed */
ul, ol {
  margin-left: 2em;
  list-style-position: outside;
}
li {
  margin-bottom: 0.5em;
}
p {
  margin-top: 2em;
  margin-bottom: 2em;
}

pre {
  background-color: #2d2d2d;
  border: 1px solid #3c3c3c;
  padding: 0.1em;
  margin-top: 1em;
  margin-bottom: 1em;
  overflow-x: auto;
}

strong { font-weight: bold; }
em { font-style: italic; }

.code-language {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  background-color: #2d2d2d; /* Same as the code block background for consistency */
  margin-left: 1em;
  display: block; /* To ensure it takes the full width */
  padding: 0.1em;
}

</style>