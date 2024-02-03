<template>
  <v-virtual-scroll :items="interactions" height="1120">
    <template v-slot:default="{item}">
      <v-card class="mt-2"
      :color="selectedInteractions.includes(item.interaction_session_id) ? 'grey-darken-3' : undefined"
      v-on="selectMode ? { click: () => toggleSelection(item.interaction_session_id) } : {}"
      :ripple="selectMode">
        <div class="d-flex justify-space-between align-center">
            <v-card-item class="text-overline">User Prompt:</v-card-item>
          <v-card-actions>
                <v-checkbox-btn v-if="selectMode"
                color="red"  density="compact"
                :modelValue="selectedInteractions.includes(item.interaction_session_id)"/>
          </v-card-actions>
          </div>
          <v-card-item class="text-caption mt-n5">
            Tokens: {{ item.prompt_tokens}}
          </v-card-item>
          <v-card-item class="text-body-1 mt-n5"> 
            <div  v-html="$markdown.render(item.segments)"></div>
          </v-card-item>
          <v-divider></v-divider>
          <v-card-item class="text-secondary text-overline">AI Response:</v-card-item>
          <v-card-item class="text-caption text-secondary mt-n5">
           Tokens: {{item.response_tokens }}
          </v-card-item>
          <v-card-item class="text-body-1 text-secondary mt-n5"> 
            <div  v-html="$markdown.render(item.response)"></div>
          </v-card-item>
      </v-card>
    </template>
  </v-virtual-scroll>
  <PopInteractionsButton @pop:selectedInteractions="popSelectedInteractions"/>
</template>

<script setup>
import { computed, ref, defineProps, defineEmits, toRefs, watch } from 'vue'
import { useStore } from 'vuex';
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
  console.log(`selected ${selectedInteractions.value}`)
  emit('update:selectedInteractions', selectedInteractions.value)
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