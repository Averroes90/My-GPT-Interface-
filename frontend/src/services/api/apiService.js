import axios from 'axios';
import { AdapterFactory } from '@/services/api/adapters/apiAdapters';
import { processRequestData, processResponseData } from './utils';
const adapterType = 'FastAPI';
const apiAdapter = AdapterFactory.getAdapter(adapterType);

export async function sendPromptToBackend(
  prompt,
  newConversationCheckbox,
  newConversationTitle,
  conversationSessionId,
  tokenLimit,
  tokenReserve,
  modelName
) {
  try {
    const url = '/api/prompt';
    const requestData = {
      prompt,
      newConversationCheckbox,
      newConversationTitle,
      conversationSessionId,
      tokenLimit,
      tokenReserve,
      modelName,
    };
    const processedRequest = processRequestData(
      sendPromptToBackend.name,
      requestData
    );
    const response = await axios.post(url, processedRequest);
    const processedResponse = processResponseData(
      sendPromptToBackend.name,
      response.data
    );
    return processedResponse;
  } catch (error) {
    console.error(`error caught in API call`, error.response.data.detail);
    throw error;
  }
}
export async function getConversationTitles() {
  try {
    const url = '/api/get_conversation_titles';
    const response = await axios.get(url);
    const processedResponse = processResponseData(
      getConversationTitles.name,
      response.data
    );
    return processedResponse;
  } catch (error) {
    console.error(
      'Error fetching conversation titles:',
      error.response.data.detail
    );
    throw error;
  }
}

export async function fetchInteractions(conversation_session_id, modelName) {
  try {
    const url = '/api/get_interactions/';
    const response = await axios.get(
      `${url}${conversation_session_id}?model_name=${modelName}`
    );
    const adjustedResponse = apiAdapter.adjustResponse(response, url);
    return adjustedResponse.data;
  } catch (error) {
    console.error('Error fetching interactions:', error.response.data.detail);
    throw error;
  }
}

// Function that serves as the common API endpoint caller for both interactions and conversations
export async function deleteItems(type, ids) {
  try {
    const url = '/api/delete/';
    const response = await axios.delete(`${url}${type}`, {
      data: { ids: ids },
    });
    return await response.data;
  } catch (error) {
    console.error(`Error deleting ${type}s:`, error.response.data.detail);
    return null;
  }
}

export async function deleteInteractions(interactionIds) {
  return deleteItems('interactions', interactionIds);
}

export async function deleteConversation(conversationId) {
  // Ensure conversationId is an array
  //const idsArray = Array.isArray(conversationId) ? conversationId : [conversationId];

  return deleteItems('conversations', conversationId);
}

export async function popInteractions(interactionIds, newConversationTitle) {
  try {
    const url = '/api/popinteractions/';
    const response = await axios.post(url, {
      ids: interactionIds,
      newConversationTitle: newConversationTitle,
    });
    return await response.data();
  } catch (error) {
    console.error('Error popping interactions', error.response.data.detail);
    return null;
  }
}
