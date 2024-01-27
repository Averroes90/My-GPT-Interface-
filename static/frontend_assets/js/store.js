// GPTinterface2/static/frontend_assets/js/store.js

import * as api from './api.js';

export default {
  state: {
    deletionMode: false,
    notifications: [],
    chatWindows:[],
  },
  mutations: {
    toggleDeletionMode(state,newValue) {
      state.deletionMode = newValue;
    },
    
    ADD_NOTIFICATION(state, notification) { // New mutation for adding a notification
      state.notifications.push(notification);
      setTimeout(() => {
        state.notifications.shift();
      }, 3000);
    },
    REMOVE_NOTIFICATION(state, notificationIndex) { // New mutation for removing a notification
      state.notifications.splice(notificationIndex, 1);
    },
    REMOVE_INTERACTIONS(state, interactionIds) {
      // Logic to remove interactions from state
    },
    REMOVE_CONVERSATION(state, conversationId) {
      // Logic to remove conversation from state
    },
    ADD_CHAT_WINDOW(state, payload) {
      // Payload should be an object with { id, modelType }
      const existingWindow = state.chatWindows.find(window => window.id === payload.id);
      if (!existingWindow) {
        state.chatWindows.push(payload);
      }
    },
    REMOVE_CHAT_WINDOW_ID(state, id) {
      const index = state.chatWindowIds.indexOf(id);
      if (index !== -1) {
        state.chatWindowIds.splice(index, 1);
      }
    },
  },
  actions: {

      async deleteSelectedInteractions(context, payload) {
        try {
          const interactionIds = payload.ids;
          console.log('interaction ids:',interactionIds);
          const result = await api.deleteInteractions(interactionIds);
          if (result && result.success) {
            //replace with refresh chat window 
            context.commit('ADD_NOTIFICATION', { message: 'Succesfully deleted interactions!', type: 'success-message' });
            await context.dispatch('refreshAllChatWindows');    
          } else {
            context.commit('ADD_NOTIFICATION', { message: 'Failed to delete interactions.', type: 'error-message' });
          }
        } catch (error) {
          console.error('Failed to delete interactions:', error);
          context.commit('ADD_NOTIFICATION', { message: 'Failed to delete interactions.', type: 'error-message' });
        }
      },
      async deleteSelectedConversations(context, payload) {
        try {
          const conversationId = payload.ids;
          const result = await api.deleteConversation(conversationId);
          if (result && result.success) {
            context.commit('ADD_NOTIFICATION', { message: 'Succesfully deleted Conversation!', type: 'success-message' });
            for (const id of context.state.chatWindowIds) {
              await context.dispatch(`chat_${id}/populateConversationTitleList`, id);
            }             
           
          } else {
            context.commit('ADD_NOTIFICATION', { message: 'Failed to delete conversation.', type: 'error-message' });
          }
        } catch (error) {
          console.error('Failed to delete conversation:', error);
          context.commit('ADD_NOTIFICATION', { message: 'Failed to delete conversation.', type: 'error-message' });
        }
      },
      async refreshAllChatWindows(context) {
        for (const chatWindow of context.state.chatWindows) {
          await context.dispatch(`chat_${chatWindow.id}/refreshChatWindow`, { modelName: chatWindow.modelType });
        }
      },
    
  },
};