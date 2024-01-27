import * as ui from './ui.js';
import * as api from './api.js';
import hljs from 'highlight.js';

export async function deleteSelectedItems(type) {
  const selectedIds = collectSelectedIds(type); // Array to hold selected item IDs
  
  if (selectedIds.length === 0) {
    const messageContent = `No ${type.charAt(0).toUpperCase() + type.slice(1)} selected for deletion.`;
    showNotification(messageContent, 'error');
    return;
  }
  // Call the deleteItems function from api.js
  const result = await api.deleteItems(type, selectedIds);
  //console.log("Received result from API:", result);
  

  if (result && result.success) {
    const messageContent = `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`;
    showNotification(messageContent, 'success');
    await refreshOrReload(type);
   
  } else {
    //console.error(`Failed to delete selected ${type}`);
  }
}

function collectSelectedIds(type) {
  let selectedIds = [];
  // Your logic here
  if (type === 'interactions') {
    /// Collect selected interaction IDs from the chat window
    const checkboxes = document.querySelectorAll('.message-checkbox:checked');
    checkboxes.forEach(checkbox => {
      const parentMessage = checkbox.closest('[data-interaction-id]');
      const interactionId = parentMessage.dataset.interactionId;
      if (!selectedIds.includes(interactionId)) {
        selectedIds.push(interactionId);
      }
    });
  } else if (type === 'conversations') {
    // Get the selected conversation ID from the original title list
    const conversationTitleList = document.getElementById('conversationTitleList');
    const selectedConversationID = conversationTitleList.value;
    selectedIds.push(selectedConversationID); 
  }
  return selectedIds;
}

async function refreshOrReload(type) {
  if (type === 'interactions') {
    ui.refreshChatWindow();
  } else if (type === 'conversations') {
    // Refresh the conversation titles
    await loadConversationTitles();
    // Refresh the chat window
    const conversationTitleList = document.getElementById('conversationTitleList');
    const latestConversationId = conversationTitleList.value; // Assuming it's set to the latest after refresh
    ui.refreshChatWindow();
  }
}


export function createSuccessMessage(messageContent) {
  const successMessage = document.createElement('div');
  successMessage.textContent = messageContent;
  successMessage.className = 'success-message';
  return successMessage;
}

  // Function to load conversation titles from the database
export async function loadConversationTitles(keepCurrentSelection = false) {
  // Make a GET request to an endpoint that retrieves conversation titles
  const data = await api.getConversationTitles();
  //console.log('Data from getConversationTitles:', data);
  ui.setCheckboxState(!data.has_conversations, !data.has_conversations);
  const currentSelection = ui.clearAndCaptureConversationList(); // Clear previous options and capture existing state
  ui.populateConversationList(data.titles, keepCurrentSelection, currentSelection);  
}


export function showNotification(messageContent, messageType) {
  const notificationMessage = document.createElement('div');
  notificationMessage.textContent = messageContent;
  
  if (messageType === 'success') {
    notificationMessage.className = 'success-message';
  } else if (messageType === 'error') {
    notificationMessage.className = 'error-message';
  }
  
  // Append to notificationDiv
  const notificationDiv = document.getElementById('notificationDiv');
  notificationDiv.appendChild(notificationMessage);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notificationMessage.remove();
  }, 3000);
}

/**
 * Transforms raw API response to match the interactions state structure.
 * @param {Object} data - Raw API response.
 * @param {string} userPrompt - The user prompt.
 * @return {Object} Transformed interaction object.
 */
export function mapApiResponseToInteraction(data, userPrompt) {
  return {
    
    id: data.interactionId,
    prompt: userPrompt,
    response: data.response,
    prompt_tokens: data.prompt_tokens,
    response_tokens: data.response_tokens,
  };
}
/**
 * Highlights code within the interaction text.
 * @param {string} text - Either the user prompt or AI response.
 * @return {string} Text with code highlighted.
 */
export function highlightCodeInInteraction(text) {
  if (text.includes('```')) {
    return formatCodeInMessage(text);
  }
  return text;
}
// This function formats any code snippets within the AI message
export function formatCodeInMessage(response) {
  let formattedMessage = '';
  const parts = response.split('```'); // Split the message by triple backticks

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
     // This is a non-code part
      const escapedText = escapeHtml(parts[i]); // Escape HTML here
      formattedMessage += escapedText;
    } else {
      // This is a code snippet
      const formattedCode = formatCodeSnippet(parts[i]);
      formattedMessage += `<div class="code-snippet-container">${formattedCode}</div>`;
    }
  }
  return formattedMessage;
}
/**
 * Formats the given code snippet with HTML tags for Highlight.js.
 * 
 * @param {string} codeSnippet - The code snippet to be formatted.
 * @return {string} - Formatted HTML string.
 */
export function formatCodeSnippet(codeSnippet) {
  // Escape HTML in the code snippet before adding to innerHTML  
  const escapedCode = escapeHtml(codeSnippet);
  return `<pre class="code-container"><code class="hljs">${escapedCode}</code></pre>`;
  
}
export function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}


/**
 * Splits and classifies the response into code and text segments.
 * @param {string} response - Raw response string
 * @return {Array} Array of objects with `type` and `value`
 */
// export function classifyResponse(response) {
//   const segments = [];
//   const parts = response.split('```');
//   for (let i = 0; i < parts.length; i++) {
//     if (i % 2 === 0) {
//       segments.push({ type: 'text', value: parts[i] });
//     } else {
//       segments.push({ type: 'code', value: parts[i] });
//     }
//   }
//   return segments;
// }

// export function classifyResponse(response) {
//   const regex = /```([\s\S]*?)```|([\s\S]+?)(?=```|$)/g;
//   const segments = [];
//   let match;
//   while ((match = regex.exec(response)) !== null) {
//     if (match[1]) {
//       console.log(`classify code: ${match[1]}`)
//       segments.push({ type: 'code', value: match[1] }); 
//     } else if (match[2]) {
//       console.log(`classify text: ${match[0]}`)
//       segments.push({ type: 'text', value: match[2] });
//     }
//   }
//   return segments;
// }


export function classifyResponse(response) {
  const regex = /```([\s\S]*?)```|([\s\S]+?)(?=```|$)/g;
  const segments = [];
  let match;

  while ((match = regex.exec(response)) !== null) {
    if (match[1]) {
      // Code segment
      const codeElement = document.createElement('code');
      codeElement.textContent = match[1];
      hljs.highlightElement(codeElement);
      const detectedLanguage = Array.from(codeElement.classList)
        .find(className => className.startsWith('language-'))
        ?.replace('language-', '') ?? '';
      segments.push(`\`\`\`${detectedLanguage}\n${match[1]}\n\`\`\``);
    } else if (match[2]) {
      // Text segment
      segments.push(match[2]);
    }
  }
  return segments.join('\n');
}