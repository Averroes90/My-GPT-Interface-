export async function sendPromptToBackend(prompt, newConversationCheckbox, newConversationTitle, existingConversationTitle, tokenLimit, tokenReserve, modelName) {
  try{
    const response = await fetch('/api/prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        newConversationCheckbox: newConversationCheckbox,
        newConversationTitle: newConversationTitle,
        existingConversationTitle: existingConversationTitle,
        tokenLimit: tokenLimit,
        tokenReserve: tokenReserve,
        modelName: modelName
      }),
    });
    return await response.json();
  } catch (error) {
    console.error(`error caught in API call`, error);
    throw error
  }
}
export async function getConversationTitles() {
  return fetch('/api/get_conversation_titles')
    .then(response => response.json());
}

export async function fetchInteractions(conversation_session_id, modelName) {
  const response = await fetch(`/api/get_interactions/${conversation_session_id}?model=${modelName}`);
  const data = await response.json();
  return data;
}

// Function that serves as the common API endpoint caller for both interactions and conversations
export async function deleteItems(type, ids) {
  try {
    const response = await fetch(`/api/delete/${type}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: ids }),
    });
    return await response.json();
  } catch (error) {
    console.error(`Error deleting ${type}s:`, error);
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

export async function popInteractions(interactionIds , newConversationTitle) {
  try {
    const response = await fetch('/api/popinteractions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: interactionIds, newConversationTitle: newConversationTitle, }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error popping interactions', error);
    return null;
  }
}
