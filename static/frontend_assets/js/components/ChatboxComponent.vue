<template>
  <div id="chatWindow" ref="messagesDiv">
    <div id="messages" >
      <!-- Chat interaction loop -->
      <div v-for="(interaction, index) in interactions" :key="interaction.id">
        <!-- Checkbox for Deletion -->
        <v-checkbox v-if="deletionMode"  @change="toggleSelection(interaction.id)"></v-checkbox>
        <!-- User Message -->
        <div class="user-message">
          You: {{ interaction.prompt }}
        </div>

        <!-- AI Message -->
        <div class="ai-message">
          AI: 
          <!-- Loop through text and code segments -->
          <span v-for="(segment, i) in interaction.segments" :key="i">
            <!-- Display text directly -->
            <span v-if="segment.type === 'text'">{{ segment.value }}</span>
            <!-- Display code block -->
            <span v-else>
              <pre class="code-container">
                <code ref="codeBlocks" class="hljs">{{ segment.value }}</code>
              </pre>
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, defineEmits, onBeforeMount, onUpdated, nextTick, defineProps, toRef } from 'vue'
import { useStore, mapState } from 'vuex';
import { createChatWindowModule } from '../chatBoxDynamicModule.js';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // or any other style you prefer
const codeBlocks = ref(null);  // Define a ref to keep track of the code blocks
const props = defineProps(['uniqueId']);
const emit = defineEmits(); 
const uniqueId = toRef(props, 'uniqueId');
const store = useStore();
const messagesDiv = ref(null);

//const { interactions } = mapState(`chat_${uniqueId.value}`, ['interactions']);
const interactions = computed(() => store.state[`chat_${uniqueId.value}`].interactions);
const deletionMode = computed(() => store.state.deletionMode)

const selectedInteractions = ref([])

const toggleSelection = (id) => {
  emit('update:selectedInteractions', id);
}

function highlightCodeBlocks() {
  nextTick(() => {
    if (codeBlocks.value) {
      codeBlocks.value.forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  });
}
// Function to scroll to the bottom
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesDiv.value) {
      messagesDiv.value.scrollTop = messagesDiv.value.scrollHeight;
    }
  });
};
onBeforeMount(() => {
  // store.registerModule(`chat_${uniqueId.value}`, createChatWindowModule(uniqueId.value));
  // store.commit('ADD_CHAT_WINDOW_ID', uniqueId.value);
});

onMounted(() => {
  highlightCodeBlocks
  scrollToBottom();
});
onUpdated(() => {
  // Update the code highlight and scroll to the bottom
  highlightCodeBlocks();
  scrollToBottom();
});

onBeforeUnmount(() => {
  store.unregisterModule(`chat_${uniqueId.value}`);
  store.commit('REMOVE_CHAT_WINDOW_ID', uniqueId.value);
});


</script>

<!-- Add your styles here -->
<style scoped>

#chatWindow {
  height: 60vh; /* Set a height */
  flex: 0.8; /* Reduce height by 20% */
  overflow-y: scroll;
  padding: 20px;
  margin-bottom: 30px; /* Increase margin to separate from the form */
  width: 90%; /* Reduce width by 10% */
  margin-left: auto; /* Center the chat window horizontally */
  margin-right: auto; /* Center the chat window horizontally */
}
#response {
  padding: 10px;
  text-align: center;
  margin-top: 110px; /* Add margin to the top to avoid the Safari toolbar */
}
#messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-message {
  color: #f0f0f0;  /* This is the original white color for the user */
  padding: 5px;
}

.ai-message {
  color: #85c1e9;  /* This is a light blue shade which complements the existing dark theme */
  padding: 5px;
}
</style>