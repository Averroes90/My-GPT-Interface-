import { store } from '@/vueApp';

export function useNotifications() {
	const addNotification = (message, type) => {
		store.commit('ADD_NOTIFICATION', { message, type });
	};

	return {
		addNotification,
	};
}
