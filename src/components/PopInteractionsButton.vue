<template>
	<v-overlay
		class="justify-end align-end ma-0 pa-0"
		contained
		persistent
		no-click-animation
		:model-value="selectMode"
		:scrim="false"
		z-index="1"
		scroll-strategy="none"
	>
		<v-btn
			v-if="selectMode"
			prepend-icon="mdi-open-in-new"
			color="blue"
			text="Pop Selected Interactions"
			@click="popInteractions"
		>
		</v-btn>
	</v-overlay>
</template>
<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const emit = defineEmits(['pop:selectedInteractions']);

const selectMode = computed(() => store.state.selectMode);

const popInteractions = () => {
	emit('pop:selectedInteractions');
};
</script>
