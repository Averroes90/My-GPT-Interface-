import { fetchInteractions, sendPromptToBackend, getConversationTitles } from './api.js';
import { mapApiResponseToInteraction, classifyResponse } from './utils.js';


export const createChatWindowModule = (uniqueId) => ({
  namespaced: true,
  state: () => ({
    interactions: [],
    selectedConversationId: null,
    conversationTitlelist: [],
    has_conversations:false, 
  }),
  mutations: {
    setInteractions(state, interactions) {
      state.interactions = interactions.map(interaction => ({
        ...interaction,
        segments: classifyResponse(interaction.prompt),
      }));
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
    },
    SET_CONVERSATION_TITLES(state, titles) {
      state.conversationTitlelist = titles;
      if (titles.length > 0) {
        state.selectedConversationId = titles[titles.length - 1].id;
      }
    },
    SET_HAS_CONVERSATIONS(state, hasConversations) {
      state.has_conversations = hasConversations;
    },
  },
  actions: {
    async refreshChatWindow({ state, commit }) {
      const interactions = await fetchInteractions(state.selectedConversationId);
      console.log(`interactions responses: ${interactions}`)
      commit('setInteractions', interactions);
    },
    async loadChatWindow(context, uniqueId) {
      try {
        const data = await getConversationTitles();
        const recentConversationId = data.titles[data.titles.length - 1]?.id || null;
        if (recentConversationId) {
          context.commit('setSelectedConversationId', recentConversationId);
          await context.dispatch('refreshChatWindow');
        }
      } catch (error) {
        console.error("Failed to load and refresh chat window:", error);
        // add your error handling here
      }
    },
    async populateConversationTitleList(context) {
      try {
        const data = await getConversationTitles();
        
        // Commit the titles and has_conversations to the state.
        context.commit('SET_CONVERSATION_TITLES', data.titles);
        context.commit('SET_HAS_CONVERSATIONS', data.titles.length > 0);
  
      } catch (error) {
        console.error("Failed to populate conversation titles:", error);
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
        }else {
          const transformedData = mapApiResponseToInteraction(data, payload.userPrompt);
          console.log(`new response: ${transformedData.response}`)
          context.commit('addInteraction', transformedData); // Assuming data contains the interaction you want to add
        }  

     } catch (error) {
       console.error("error in api call", error);
       console.error(error.stack);
      }
    }

  },
});