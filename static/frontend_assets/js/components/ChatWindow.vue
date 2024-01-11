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
            <UserMessage :message="interaction.prompt" />
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