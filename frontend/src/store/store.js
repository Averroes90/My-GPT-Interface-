// GPTinterface2/static/frontend_assets/js/store.js

import * as api from '@/api.js';

export default {
  state: {
    selectMode: false,
    notifications: [],
    chatWindows: {},
  },
  mutations: {
    toggleSelectMode(state, newValue) {
      state.selectMode = newValue;
    },

    ADD_NOTIFICATION(state, notification) {
      // New mutation for adding a notification
      state.notifications.push(notification);
      setTimeout(() => {
        state.notifications.shift();
      }, 3000);
    },
    REMOVE_NOTIFICATION(state, notificationIndex) {
      // New mutation for removing a notification
      state.notifications.splice(notificationIndex, 1);
    },
    ADD_CHAT_WINDOW(state, { windowId, modelName }) {
      if (!state.chatWindows[windowId]) {
        state.chatWindows[windowId] = {
          selectedConversationId: null,
          conversationTitleList: [],
          has_conversations: false,
          modelName: modelName, // Initialized here
        };
      } else {
        console.warn(
          `Chat window with ID ${windowId} already exists. Use a different mutation to update it.`
        );
      }
    },
    REMOVE_CHAT_WINDOW(state, windowId) {
      delete state.chatWindows[windowId]; // No need of Vue.delete in Vue 3
    },
    ADD_ATTRIBUTE_TO_CHAT_WINDOW(
      state,
      { windowId, attributeName, attributeValue }
    ) {
      const chatWindow = state.chatWindows[windowId];
      if (chatWindow) {
        chatWindow[attributeName] = attributeValue;
      }
    },
  },
  actions: {
    async populateConversationTitleList(context, payload) {
      try {
        const data = await api.getConversationTitles();
        // Commit the titles and has_conversations to the state.
        context.commit('ADD_ATTRIBUTE_TO_CHAT_WINDOW', {
          windowId: payload.windowId,
          attributeName: 'conversationTitleList',
          attributeValue: data.titles,
        });
        context.commit('ADD_ATTRIBUTE_TO_CHAT_WINDOW', {
          windowId: payload.windowId,
          attributeName: 'has_conversations',
          attributeValue: data.has_conversations,
        });
        if (data.titles.length > 0) {
          context.commit('ADD_ATTRIBUTE_TO_CHAT_WINDOW', {
            windowId: payload.windowId,
            attributeName: 'selectedConversationId',
            attributeValue: data.selected_conversation_id,
          });
        }
      } catch (error) {
        console.error('Failed to populate conversation titles:', error);
        // Additional error handling logic here
      }
    },
    async deleteSelectedInteractions(context, payload) {
      try {
        const interactionIds = payload.ids;
        console.log('interaction ids:', interactionIds);
        const result = await api.deleteInteractions(interactionIds);
        if (result && result.success) {
          //replace with refresh chat window
          context.commit('ADD_NOTIFICATION', {
            message: 'Succesfully deleted interactions!',
            type: 'success-message',
          });
          await context.dispatch('refreshAllChatWindows');
        } else {
          context.commit('ADD_NOTIFICATION', {
            message: 'Failed to delete interactions.',
            type: 'error-message',
          });
        }
      } catch (error) {
        console.error('Failed to delete interactions:', error);
        context.commit('ADD_NOTIFICATION', {
          message: 'Failed to delete interactions.',
          type: 'error-message',
        });
      }
    },
    async deleteSelectedConversations({ state, commit, dispatch }) {
      try {
        for (const windowId in state.chatWindows) {
          const chatWindow = state.chatWindows[windowId];
          const conversationId = chatWindow.selectedConversationId;

          // Skip this chat window if no selected conversation ID
          if (!conversationId) continue;

          const result = await api.deleteConversation([conversationId]);
          if (result && result.success) {
            // Notify success
            commit('ADD_NOTIFICATION', {
              message: `Successfully deleted Conversation from ${windowId}!`,
              type: 'success-message',
            });
            // Dispatch the "populateConversationTitleList" GLOBAL action
            await dispatch('populateConversationTitleList', { windowId });
          } else {
            // Notify failure
            commit('ADD_NOTIFICATION', {
              message: `Failed to delete conversation from ${windowId}!`,
              type: 'error-message',
            });
          }
        }
      } catch (error) {
        console.error('Failed to delete conversation:', error);
        commit('ADD_NOTIFICATION', {
          message: 'Failed to delete conversation.',
          type: 'error-message',
        });
      }
    },
    async refreshAllChatWindows(context) {
      for (const windowId in context.state.chatWindows) {
        const chatWindow = context.state.chatWindows[windowId];
        await context.dispatch(`chat_${windowId}/refreshChatWindow`, {
          modelName: chatWindow.modelName,
          selectedConversationId: chatWindow.selectedConversationId,
        });
      }
    },
    async popSelectedInteractions(context, payload) {
      try {
        const result = await api.popInteractions(
          payload.ids,
          payload.newConversationTitle
        );
        if (result && result.success) {
          //replace with refresh chat window
          context.commit('ADD_NOTIFICATION', {
            message: 'New conversation created with selected interactions!',
            type: 'success-message',
          });
          await context.dispatch('populateConversationTitleList', {
            windowId: payload.windowId,
          });
        } else {
          context.commit('ADD_NOTIFICATION', {
            message: 'Failed to pop intteractions.',
            type: 'error-message',
          });
        }
      } catch (error) {
        console.error('Failed to pop interactions:', error);
        context.commit('ADD_NOTIFICATION', {
          message: 'Failed to pop interactions.',
          type: 'error-message',
        });
      }
    },
  },
};
