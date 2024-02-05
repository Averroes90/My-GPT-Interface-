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
    selectedConversationId: null,
    conversationTitlelist: [],
    has_conversations: false,
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
    setSelectedConversationId(state, id) {
      state.selectedConversationId = id;
    },
    addInteraction(state, interaction) {
      const processedInteraction = {
        ...interaction,
        segments: classifyResponse(interaction.prompt),
      };
      state.interactions.push(processedInteraction);
      state.interactions = state.interactions.slice(0);
    },
    SET_CONVERSATION_TITLES(state, titles) {
      state.conversationTitlelist = titles;
    },
    SET_HAS_CONVERSATIONS(state, hasConversations) {
      state.has_conversations = hasConversations;
    },
  },
  actions: {
    async refreshChatWindow({ state, commit }, payload) {
      const response = await fetchInteractions(
        state.selectedConversationId,
        payload.modelName
      );
      commit('setInteractions', response.interactions);
      commit('setTotalTokens', response.total_tokens);
    },
    async loadChatWindow(context, payload) {
      try {
        const data = await getConversationTitles();
        const recentConversationId =
          data.titles[data.titles.length - 1]?.id || null;
        if (recentConversationId) {
          context.commit('setSelectedConversationId', recentConversationId);
          await context.dispatch('refreshChatWindow', payload);
        }
      } catch (error) {
        console.error('Failed to load and refresh chat window:', error);
        // add your error handling here
      }
    },
    async populateConversationTitleList(context) {
      try {
        const data = await getConversationTitles();

        // Commit the titles and has_conversations to the state.
        context.commit('SET_CONVERSATION_TITLES', data.titles);
        context.commit('SET_HAS_CONVERSATIONS', data.titles.length > 0);
        if (data.titles.length > 0) {
          context.commit(
            'setSelectedConversationId',
            data.selected_conversation_id
          );
        }
      } catch (error) {
        console.error('Failed to populate conversation titles:', error);
        // Additional error handling logic here
      }
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
          await context.dispatch('populateConversationTitleList');
          context.commit('setSelectedConversationId', data.conversationId); // Set the selected conversation ID
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
