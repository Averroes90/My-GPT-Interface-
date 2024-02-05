<template>
	<v-container fluid class="ma-0 pa-0 ga-0">
		<v-virtual-scroll
			:key="listVersion"
			ref="virtualScrollRef"
			:items="interactions"
			height="1130"
		>
			<template #default="{ item }">
				<v-card
					class="mt-2"
					:color="
						selectedInteractions.includes(item.interaction_session_id)
							? 'grey-darken-3'
							: undefined
					"
					:ripple="selectMode"
					v-on="
						selectMode
							? { click: () => toggleSelection(item.interaction_session_id) }
							: {}
					"
				>
					<div class="d-flex justify-space-between align-center">
						<v-card-item class="text-overline">User Prompt:</v-card-item>
						<v-card-actions>
							<v-checkbox-btn
								v-if="selectMode"
								color="red"
								density="compact"
								:model-value="
									selectedInteractions.includes(item.interaction_session_id)
								"
							/>
						</v-card-actions>
					</div>
					<v-card-item class="text-caption mt-n5">
						Tokens: {{ item.prompt_tokens }}
					</v-card-item>
					<v-card-item class="text-body-1 mt-n5">
						<div v-html="$markdown.render(item.segments)"></div>
					</v-card-item>
					<v-divider></v-divider>
					<v-card-item class="text-secondary text-overline"
						>AI Response:</v-card-item
					>
					<v-card-item class="text-caption text-secondary mt-n5">
						Tokens: {{ item.response_tokens }}
					</v-card-item>
					<v-card-item class="text-body-1 text-secondary mt-n5">
						<div v-html="$markdown.render(item.response)"></div>
					</v-card-item>
				</v-card>
			</template>
		</v-virtual-scroll>
		<PopInteractionsButton
			@pop:selected-interactions="popSelectedInteractions"
		/>
	</v-container>
</template>

<script setup>
import {
	computed,
	ref,
	defineProps,
	defineEmits,
	toRefs,
	watch,
	nextTick,
} from 'vue';
import { useStore } from 'vuex';
import PopInteractionsButton from './PopInteractionsButton.vue';
import { useNotifications } from '@/composables/useNotifications';

// Define component props
const props = defineProps({
	uniqueId: String,
	newConversationCheckboxState: Boolean,
	newConversationTitle: String,
});

// Define component emits
const emit = defineEmits(['update:selectedInteractions']);

// Composables and Vuex store usage
const store = useStore();
const { addNotification } = useNotifications();

// ToRefs utility
const { uniqueId, newConversationCheckboxState, newConversationTitle } =
	toRefs(props);

// Reactive state and computed properties
const selectMode = computed(() => store.state.selectMode);
const interactions = computed(
	() => store.state[`chat_${uniqueId.value}`].interactions
);
const selectedInteractions = ref([]);
const virtualScrollRef = ref(null);
const listVersion = ref(0);

// Methods
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
	// Helper function for validating title
	const isValidTitle = () =>
		newConversationCheckboxState.value &&
		newConversationTitle.value.trim() !== '';

	if (!isValidTitle()) {
		addNotification(
			'Please enter a title for the new conversation',
			'error-message'
		);
		return;
	}

	if (
		window.confirm(
			'Are you sure you want to pop selected interactions into a new conversation?'
		)
	) {
		store.dispatch('popSelectedInteractions', {
			ids: selectedInteractions.value,
			newConversationTitle: newConversationTitle.value,
		});
		selectedInteractions.value = []; // Clear the selected items
	}
};

function scrollToItem(index) {
	const virtualScroll = virtualScrollRef.value;
	if (virtualScroll) {
		virtualScroll.scrollToIndex(index);
	}
}

// Watchers
watch(selectMode, (newVal) => {
	if (!newVal) {
		selectedInteractions.value = [];
	}
});

watch(interactions, (newInteractions) => {
	listVersion.value++;
	const index = newInteractions.length - 1;
	if (index >= 0) {
		nextTick(() => {
			scrollToItem(index);
		});
	}
});

// watch(interactions, (newInteractions, oldInteractions) => {
//   // Using nextTick to ensure the DOM is updated before attempting to scroll
//   const index = newInteractions.length -1
//   nextTick(() => {
//     scrollToItem(index)
//   });
// }, { deep: true });

// onBeforeUnmount(() => {
//   console.log('on beforemount');
//   store.unregisterModule(`chat_${uniqueId.value}`);
//   store.commit('REMOVE_CHAT_WINDOW_ID', uniqueId.value);
// });
</script>
<style>
h1,
h2,
h3,
h4,
h5,
h6 {
	margin-top: 1em;
	margin-bottom: 0.5em;
	font-weight: bold;
}
h1 {
	font-size: 2em;
}
h2 {
	font-size: 1.75em;
}
h3 {
	font-size: 1.5em;
}
/* Continue for h4, h5, h6 as needed */
ul,
ol {
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

strong {
	font-weight: bold;
}
em {
	font-style: italic;
}

.code-language {
	font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro',
		monospace;
	background-color: #2d2d2d; /* Same as the code block background for consistency */
	margin-left: 1em;
	display: block; /* To ensure it takes the full width */
	padding: 0.1em;
}
</style>
