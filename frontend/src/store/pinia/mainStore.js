import { defineStore } from 'pinia';

export const useMainStore = defineStore('mainStore', {
  state: () => ({
    selectMode: false,
    notifications: [],
  }),
  actions: {
    toggleSelectMode(newValue) {
      this.selectMode = newValue;
    },
    addNotification(notification) {
      this.notifications.push(notification);
      setTimeout(() => {
        this.notifications.shift();
      }, 3000);
    },
    removeNotification(notificationIndex) {
      this.notifications.splice(notificationIndex, 1);
    },
  },
});
