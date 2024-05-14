import { defineStore } from 'pinia';
import {
  fetchInteractions,
  sendPromptToBackend,
} from '@/services/api/apiService.js';
import { mapApiResponseToInteraction, classifyResponse } from '@/utils.js';

export const useConversationStore = defineStore('conversations', {
  // State
  state: () => ({
    conversations: {},
  }),

  //Actions
  actions: {
    async refreshChatWindow(conversationSessionId, modelName) {
      const response = await fetchInteractions(
        conversationSessionId,
        modelName
      );
      this.conversations[conversationSessionId] = {
        interactions: response.interactions.map((interaction) => ({
          ...interaction,
          segments: classifyResponse(interaction.prompt),
        })),
      };
    },

    async sendPrompt(conversationSessionId, payload) {
      try {
        const data = await sendPromptToBackend(
          payload.userPrompt,
          payload.newConversationCheckbox,
          payload.newConversationTitle,
          payload.conversationSessionId,
          payload.tokenLimit,
          payload.tokenReserve,
          payload.modelName
        );

        const conversation = this.conversations[conversationSessionId];
        if (!conversation) {
          console.error(
            `Conversation with ID ${conversationSessionId} not found`
          );
          return;
        }

        if (payload.newConversationCheckbox) {
          // Logic for handling new conversation, potentially updating the list or
          // creating a new window entry
        } else {
          const transformedData = mapApiResponseToInteraction(
            data,
            payload.userPrompt
          );
          const classifiedInteraction = {
            ...transformedData,
            segments: classifyResponse(transformedData.prompt),
          };
          conversation.interactions.push(classifiedInteraction);
          conversation.contextTokens = data.context_token_count;
          conversation.totalTokens +=
            data.response_token_count + data.prompt_token_count;
        }
      } catch (error) {
        console.error('error in api call', error);
      }
    },
  },
});
