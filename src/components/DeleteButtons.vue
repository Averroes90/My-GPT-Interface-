<template>
	<v-card>
		<!-- Deletion buttons -->
		<v-btn
			v-if="selectMode"
			prepend-icon="mdi-trash-can"
			stacked
			color="red"
			@click="deleteSelectedInteractions"
		>
			Delete Selected Interactions
		</v-btn>
		<v-btn
			v-if="selectMode"
			prepend-icon="mdi-trash-can"
			stacked
			color="red"
			@click="deleteSelectedConversations"
		>
			Delete Selected Conversation
		</v-btn>
	</v-card>
</template>
<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const emit = defineEmits([
	'Delete:selectedInteractions',
	'Delete:selectedConversation',
]);

const selectMode = computed(() => store.state.selectMode);

const deleteSelectedInteractions = () => {
	emit('Delete:selectedInteractions');
};

const deleteSelectedConversations = () => {
	emit('Delete:selectedConversation');
};
</script>
