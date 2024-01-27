<template>
    <v-card>
    <!-- Deletion buttons -->
        <v-btn
            prepend-icon="mdi-trash-can" stacked
            v-if="deletionMode"
            color="red"
            @click="deleteSelectedInteractions">
            Delete Selected Interactions
        </v-btn>
        <v-btn
            prepend-icon="mdi-trash-can" stacked
            v-if="deletionMode"
            color="red"
            @click="deleteSelectedConversations">
            Delete Selected Conversation
        </v-btn>
    </v-card>
</template>
<script setup>

    import { computed , defineEmits } from 'vue';
    import { useStore } from 'vuex';
    const store = useStore();
    const emit = defineEmits()

    const deletionMode = computed(() => store.state.deletionMode)


    const deleteSelectedInteractions = () => {
        emit('Delete:selectedInteractions');
    };

    const deleteSelectedConversations = () => {
        emit('Delete:selectedConversation');
    };

</script>