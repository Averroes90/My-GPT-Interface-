import { defineStore } from 'pinia';
import * as api from '@/services/api/apiService.js';

export const useChatWindowsStore = defineStore('chatWindows', {
  //State
  state: () => ({
    chatWindows: {},
  }),
  addChatWindow(windowId, modelName) {
    if (!this.chatWindows[windowId]) {
      this.chatWindows[windowId] = {
        selectedConversationId: null,
        conversationTitleList: [],
        hasConversations: false,
        modelName: modelName, // Initialized here
      };
    } else {
      console.warn(
        `Chat window with ID ${windowId} already exists. Use a different mutation to update it.`
      );
    }
  },
  removeChatWindow(windowId) {
    if (!this.chatWindows[windowId]) {
      delete this.chatWindows[windowId];
    } else {
      console.warn(`Chat window with ID ${windowId} does not exist`);
    }
  },
  addAtributeToChatWindow(windowId, attributeName, attributeValue) {
    const chatWindow = this.chatWindows[windowId];
    if (chatWindow) {
      chatWindow[attributeName] = attributeValue;
    }
  },
});
