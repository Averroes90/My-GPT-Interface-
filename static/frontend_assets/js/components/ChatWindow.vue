<template>
    <v-container fluid class="d-flex mt-15 mb-10" style="height: 75vh;">
    <div class="overflow-y-auto" ref="messagesContainer">
      <v-row class="ma-0 pa-0">
        <v-col v-for="(interaction, index) in interactions" :key="interaction.id" cols="12">
          <v-row class="align-center">
            <!-- Conditional checkbox for deletion mode -->
            <v-col v-if="deletionMode" cols="1">
              <v-checkbox @change="toggleSelection(interaction.id)"></v-checkbox>
            </v-col>
            <!-- User Message -->
            <UserMessage 
            :message="interaction.prompt" 
            :segments="interaction.segments"/>
            <!-- AI Message -->
            <AIMessage :response="interaction.response" />
          </v-row>
        </v-col>
      </v-row>
    </div>
    </v-container>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, onUpdated, nextTick, defineProps, defineEmits, toRef, onBeforeMount, watch } from 'vue'
import { useStore } from 'vuex';
import UserMessage from './UserMessage.vue';
import AIMessage from './AIMessage.vue';
const props = defineProps({ uniqueId: String });
const emit = defineEmits(['update:selectedInteractions']);
const store = useStore();
const uniqueId = toRef(props, 'uniqueId');
// const uniqueId = ref("WindowMain"); //associated chatwindow
const interactions = computed(() => store.state[`chat_${uniqueId.value}`].interactions);
const deletionMode = computed(() => store.state.deletionMode);
const messagesContainer = ref(null);

const toggleSelection = (id) => {
  emit('update:selectedInteractions', id);
};

// Watch for changes in interactions
watch(interactions, (newInteractions, oldInteractions) => {
  // Using nextTick to ensure the DOM is updated before attempting to scroll
  nextTick(() => {
    scrollToBottom();
  });
}, { deep: true });

watch(deletionMode, (newdel, olddel) => {
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

onBeforeUnmount(() => {
  console.log('on beforemount');
  store.unregisterModule(`chat_${uniqueId.value}`);
  store.commit('REMOVE_CHAT_WINDOW_ID', uniqueId.value);
});
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