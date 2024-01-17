<template>
  <v-app>
    <v-container fluid class="d-flex flex-column flex-grow-1">
      <NotificationComponent/>
      <v-card-actions
        style="position: absolute; top: 0; right: 0; z-index: 2;">
        <DeleteButtons @Delete:selectedInteractions="deleteSelectedInteractions"
          @Delete:selectedConversation="deleteSelectedConversations"/>
      </v-card-actions>
        <ParentChatInstance1 @update:selectedInteractions="updateSelectedInteractions"
          @update:selectedConversation="updateSelectedConversation" class="pb-0"/>
        <!-- Delete Mode Toggle Button -->
          <SwitchComponent
            v-model="deletionMode"
            color="red"
            label="Toggle Deletion Mode"
            :model="deletionMode"/>
  </v-container>
  </v-app>
</template>
  
<script setup>
  // Import your child components here
  import NotificationComponent from './NotificationComponent.vue';
  import ParentChatInstance1 from './ParentChatInstance1.vue';
  import SwitchComponent from './SwitchComponent.vue';
  import DeleteButtons from './DeleteButtons.vue';
  import { computed, ref } from 'vue';
  import { useStore } from 'vuex';
  const store = useStore();
  const selectedInteractions = ref([]); // Keep a state in the parent too
  const selectedConversation = ref([]);
  const deletionMode = computed({
    get: () => store.state.deletionMode,
    set: (newValue) => store.commit('toggleDeletionMode', newValue)
  });
  
const deleteSelectedInteractions = () => {
  const userConfirmed = window.confirm("Are you sure you want to delete the selected interactions?");
  if (userConfirmed) {
    store.dispatch('deleteSelectedInteractions', { type: 'interactions', ids: selectedInteractions.value });
    selectedInteractions.value = []; // Clear the selected items
  }
};

const deleteSelectedConversations = () => {
  const userConfirmed = window.confirm("Are you sure you want to delete the selected conversation?");
  if (userConfirmed) {
    store.dispatch('deleteSelectedConversations', { type: 'conversations', ids: [selectedConversation.value] });
    //selectedConversation.value = []; // Clear the selected items
  }
};
const updateSelectedInteractions = (newSelectedInteractions) => {
  const indexI = selectedInteractions.value.indexOf(newSelectedInteractions);
  if (indexI === -1) {
    // ID not found in array, add it
    selectedInteractions.value.push(newSelectedInteractions);
  } else {
    // ID found, remove it
    selectedInteractions.value.splice(indexI, 1);
  }
};

const updateSelectedConversation =(newSelectedConversation)=>{
  selectedConversation.value = newSelectedConversation.value
}
</script>
