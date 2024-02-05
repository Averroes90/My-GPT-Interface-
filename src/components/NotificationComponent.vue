<template>
	<div id="notificationDiv">
		<div
			v-for="(notification, index) in notifications"
			:key="index"
			:class="notification.type"
			@click="removeNotification(index)"
		>
			{{ notification.message }}
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// Map the Vuex state to a local computed property
const notifications = computed(() => store.state.notifications);

// Function to manually remove notifications
function removeNotification(index) {
	store.commit('REMOVE_NOTIFICATION', index);
}
</script>
<style scoped>
.success-message {
	background-color: #4caf50; /* Green background */
	color: #f0f0f0; /* White text */
	text-align: center;
	position: fixed;
	top: 0;
	left: 0;
	padding: 15px;
	width: 100%;
	z-index: 1000;
	font-size: 1.2em;
}

.error-message {
	background-color: #f44336; /* Red background */
	color: #f0f0f0; /* White text */
	text-align: center;
	position: fixed;
	top: 0;
	left: 0;
	padding: 15px;
	width: 100%;
	z-index: 1000;
	font-size: 1.2em;
}
</style>
