import {
  fetchInteractions,
  sendPromptToBackend,
  getConversationTitles,
} from '@/api.js';
import { mapApiResponseToInteraction, classifyResponse } from '@/utils.js';

export const createChatWindowModule = () => ({
  namespaced: true,
  state: () => ({
    interactions: [],
    contextTokens: 0,
    totalTokens: 0,
  }),
  mutations: {
    setInteractions(state, interactions) {
      state.interactions = interactions.map((interaction) => ({
        ...interaction,
        segments: classifyResponse(interaction.prompt),
      }));
    },
    setContextTokens(state, contextTokens) {
      state.contextTokens = contextTokens;
    },
    setTotalTokens(state, totalTokens) {
      state.totalTokens = totalTokens;
    },
    incrementTotalTokens(state, tokensToAdd) {
      state.totalTokens += tokensToAdd;
    },

    addInteraction(state, interaction) {
      const processedInteraction = {
        ...interaction,
        segments: classifyResponse(interaction.prompt),
      };
      state.interactions.push(processedInteraction);
      state.interactions = state.interactions.slice(0);
    },
  },
  actions: {
    async refreshChatWindow({ commit }, payload) {
      const response = await fetchInteractions(
        payload.selectedConversationId,
        payload.modelName
      );
      commit('setInteractions', response.interactions);
      commit('setTotalTokens', response.total_tokens);
    },
    async sendPrompt(context, payload) {
      try {
        const data = await sendPromptToBackend(
          payload.userPrompt,
          payload.newConversationCheckbox,
          payload.newConversationTitle,
          payload.existingConversationTitle,
          payload.tokenLimit,
          payload.tokenReserve,
          payload.modelName
        );
        if (payload.newConversationCheckbox) {
          await context.dispatch(
            'populateConversationTitleList',
            { windowId: payload.windowId },
            { root: true }
          );
          context.commit(
            'ADD_ATTRIBUTE_TO_CHAT_WINDOW',
            {
              windowId: payload.windowId,
              attributeName: 'selectedConversationId',
              attributeValue: data.conversationId,
            },
            { root: true }
          ); // Set the selected conversation ID
        } else {
          const transformedData = mapApiResponseToInteraction(
            data,
            payload.userPrompt
          );
          context.commit('addInteraction', transformedData); // Assuming data contains the interaction you want to add
          context.commit('setContextTokens', data.context_total_tokens); // Update the total token count
          context.commit(
            'incrementTotalTokens',
            data.response_tokens + data.prompt_tokens
          );
        }
      } catch (error) {
        console.error('error in api call', error);
        console.error(error.stack);
      }
    },
  },
});
