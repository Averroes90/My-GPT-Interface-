<template>
  <v-app>
    <v-container
      fluid
      class="d-flex flex-column flex-grow-1 fill-height pb-0 align-start"
    >
      <NotificationComponent />
      <v-card-actions style="position: absolute; top: 0; right: 0; z-index: 2">
        <DeleteButtons
          @delete:selected-interactions="deleteSelectedInteractions"
          @delete:selected-conversation="deleteSelectedConversations"
        />
      </v-card-actions>
      <ParentChatInstance1
        class="pb-0"
        @update:selected-interactions="updateSelectedInteractions"
      />
      <!-- Delete Mode Toggle Button -->
      <SwitchComponent
        v-model="selectMode"
        color="red"
        label="Toggle Selection Mode"
        :model="selectMode"
      />
    </v-container>
  </v-app>
</template>

<script setup>
// Import your child components here
import NotificationComponent from '@/components/NotificationComponent.vue';
import ParentChatInstance1 from '@/components/ParentChatInstance1.vue';
import SwitchComponent from '@/components/SwitchComponent.vue';
import DeleteButtons from '@/components/DeleteButtons.vue';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const selectedInteractions = ref([]); // Keep a state in the parent too
const selectMode = computed({
  get: () => store.state.selectMode,
  set: (newValue) => store.commit('toggleSelectMode', newValue),
});

const deleteSelectedInteractions = () => {
  const userConfirmed = window.confirm(
    'Are you sure you want to delete the selected interactions?'
  );
  if (userConfirmed) {
    store.dispatch('deleteSelectedInteractions', {
      type: 'interactions',
      ids: selectedInteractions.value,
    });
    selectedInteractions.value = []; // Clear the selected items
  }
};

const deleteSelectedConversations = () => {
  const userConfirmed = window.confirm(
    'Are you sure you want to delete the selected conversation?'
  );
  if (userConfirmed) {
    store.dispatch('deleteSelectedConversations', {
      type: 'conversations',
    });
    //selectedConversation.value = []; // Clear the selected items
  }
};
const updateSelectedInteractions = (newSelectedInteractions) => {
  selectedInteractions.value = newSelectedInteractions;
};
</script>
