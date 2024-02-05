import * as api from './api.js';
import * as utils from './utils.js';
import hljs from 'highlight.js';
//import 'highlight.js/styles/github-dark.css'; // or any other style you prefer

export function setCheckboxState(state, isDatabaseEmpty = false) {
  const newConversationCheckbox = document.getElementById(
    'newConversationCheckbox'
  );
  newConversationCheckbox.checked = state; // Set the checkbox state
  newConversationCheckbox.disabled = isDatabaseEmpty; // Disable if the database is empty, enable otherwise
  toggleConversationControl(); // Update UI state accordingly
}
// Function to toggle conversation control based on checkbox
export function toggleConversationControl() {
  const newConversationCheckbox = document.getElementById(
    'newConversationCheckbox'
  );
  const newConversationTitle = document.getElementById('newConversationTitle');
  const conversationTitleList = document.getElementById(
    'conversationTitleList'
  );

  if (newConversationCheckbox.checked) {
    newConversationTitle.disabled = false;
    conversationTitleList.disabled = true;
  } else {
    newConversationTitle.disabled = true;
    conversationTitleList.disabled = false;
  }
}

export function displayUserMessage(interactionId, prompt) {
  const messagesDiv = document.getElementById('messages');
  const userMessage = document.createElement('div');
  userMessage.textContent = 'You: ' + prompt;
  userMessage.className = 'user-message'; // Added class
  userMessage.dataset.interactionId = interactionId; // Attach interaction ID as a data attribute

  // Adding a checkbox for selection in deletion mode
  if (deletionModeActive) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'message-checkbox'; // Class for styling
    userMessage.appendChild(checkbox);
  }
  //console.log("Displaying User Message: ", prompt);
  messagesDiv.appendChild(userMessage);
}

export function displayAIMessage(interactionId, response) {
  const messagesDiv = document.getElementById('messages');
  const aiMessage = document.createElement('div');
  aiMessage.className = 'ai-message';
  aiMessage.dataset.interactionId = interactionId; // Attach interaction ID as a data attribute

  // Check if the message contains a code snippet
  if (response.includes('```')) {
    const formattedMessage = utils.formatCodeInMessage(response);
    aiMessage.innerHTML = `AI: ${formattedMessage}`;
    aiMessage.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  } else {
    aiMessage.textContent = 'AI: ' + response;
  }

  messagesDiv.appendChild(aiMessage);
  // Manually trigger Highlight.js to highlight code under the newly added aiMessage element
  aiMessage.scrollIntoView({ behavior: 'smooth' });
}

export function postResponseProcess(
  newConversationCheckbox,
  newConversationTitleElement
) {
  const promptElement = document.getElementById('userPrompt');
  promptElement.value = '';
  if (newConversationCheckbox) {
    setCheckboxState(false);
    newConversationTitleElement.value = '';
    utils.loadConversationTitles(false);
  } else {
    utils.loadConversationTitles(true);
  }
}

export function clearAndCaptureConversationList() {
  const conversationTitleList = document.getElementById(
    'conversationTitleList'
  );
  const currentSelection = conversationTitleList.value;
  conversationTitleList.innerHTML = '';
  return currentSelection;
}

export function populateConversationList(
  titles,
  keepCurrentSelection,
  currentSelection
) {
  const conversationTitleList = document.getElementById(
    'conversationTitleList'
  );
  titles.forEach((title, index) => {
    //console.log('Populating list with titles:', titles);
    const option = document.createElement('option');
    option.value = title.id;
    option.text = title.name;
    conversationTitleList.appendChild(option);

    if (keepCurrentSelection && title.id === currentSelection) {
      conversationTitleList.value = title.id;
    } else if (!keepCurrentSelection && index === titles.length - 1) {
      conversationTitleList.value = title.id;
    }
  });
}

export function checkUserEntries() {
  const newConversationCheckbox = document.getElementById(
    'newConversationCheckbox'
  ).checked;
  const newConversationTitleElement = document.getElementById(
    'newConversationTitle'
  );
  const newConversationTitle = newConversationCheckbox
    ? newConversationTitleElement.value.trim()
    : '';

  // Check if the user opted to create a new conversation but left the conversation title box empty
  if (newConversationCheckbox && newConversationTitle === '') {
    alert(
      'New Conversation Title cannot be empty when "New Conversation" is checked.'
    );
    return false; // Return false to indicate an error
  }
  return true; // Return true to indicate that everything is okay
}

export function renderInteractions(interactions) {
  //console.log('Interactions to render:', interactions);
  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML = ''; // Clear the chat window

  interactions.forEach((interaction) => {
    displayUserMessage(interaction.id, interaction.prompt); // Pass interaction ID
    displayAIMessage(interaction.id, interaction.response); // Pass interaction ID
  });
}

export function renderTruncationPartition(truncationIndex) {
  // Remove any existing partitions
  const existingPartitions = document.querySelectorAll('.partition');
  existingPartitions.forEach((partition) => partition.remove());

  if (truncationIndex >= 0) {
    // Only render if truncation occurred
    const messagesContainer = document.getElementById('messages'); // Targeting the messages container
    const partitionElement = document.createElement('div');
    partitionElement.className = 'partition'; // Assign a class for easy removal
    partitionElement.textContent = '---';
    // Calculate the correct position based on the truncation index
    const position = truncationIndex * 2; // Assuming each interaction has two child elements
    // Insert the partition at the appropriate place based on the truncation index
    messagesContainer.insertBefore(
      partitionElement,
      messagesContainer.children[position]
    );
  }
}

export let deletionModeActive = false; // Global state to track the deletion mode

export function toggleDeletionMode() {
  // Toggle the deletion mode state
  deletionModeActive = !deletionModeActive;

  // Reference to the deletion mode button
  const deletionModeButton = document.getElementById('deletionModeButton');
  const existingDeleteInteractionsButton = document.getElementById(
    'deleteInteractionsButton'
  );
  const existingDeleteConversationsButton = document.getElementById(
    'deleteConversationsButton'
  );
  if (existingDeleteInteractionsButton) {
    existingDeleteInteractionsButton.remove();
  }
  if (existingDeleteConversationsButton) {
    existingDeleteConversationsButton.remove();
  }
  // Update the button's appearance and text based on the deletion mode state
  if (deletionModeActive) {
    deletionModeButton.textContent = 'Deletion Mode: ON';
    deletionModeButton.style.backgroundColor = '#f44336'; // Red color for active state

    // Additional logic to enable/disable selection of individual interactions or entire conversations for deletion
    // ...
    refreshChatWindow();
    createDeleteButtons();
  } else {
    deletionModeButton.textContent = 'Deletion Mode: OFF';
    deletionModeButton.style.backgroundColor = '#555'; // Default color for inactive state
    // Additional logic to revert the UI to its normal state
    refreshChatWindow();
  }
}

export function refreshChatWindow() {
  const conversationTitleList = document.getElementById(
    'conversationTitleList'
  );
  const selectedConversationSessionId = conversationTitleList.value; // Explicit reference to get the currently selected conversation

  // Fetch and render interactions for the selected conversation
  api
    .fetchInteractions(selectedConversationSessionId)
    .then((interactions) => {
      console.log('Received interactions:', interactions); // Log for debugging
      renderInteractions(interactions);
    })
    .catch((error) => {
      console.error('Failed to refresh chat window:', error);
    });
}

export function createDeleteButtons() {
  // Delete Interactions Button
  const deleteInteractionsButton = document.createElement('button');
  deleteInteractionsButton.id = 'deleteInteractionsButton';
  deleteInteractionsButton.textContent = 'Delete Selected Interactions';
  deleteInteractionsButton.className = 'delete-button'; // Class for styling
  deleteInteractionsButton.type = 'button'; // Add this line

  // Delete Conversations Button
  const deleteConversationsButton = document.createElement('button');
  deleteConversationsButton.id = 'deleteConversationsButton';
  deleteConversationsButton.textContent = 'Delete Selected Conversations';
  deleteConversationsButton.className = 'delete-button'; // Class for styling
  deleteConversationsButton.type = 'button'; // Add this line

  // Append the delete buttons to the same parent container as the deletionModeButton
  const deletionModeButton = document.getElementById('deletionModeButton');
  const parentContainer = deletionModeButton.parentElement;
  parentContainer.appendChild(deleteInteractionsButton);
  parentContainer.appendChild(deleteConversationsButton);
  deleteInteractionsButton.addEventListener('click', async function () {
    if (
      window.confirm(
        'Are you sure you want to delete the selected interactions? note: selected interactions will be deleted in pairs'
      )
    ) {
      await utils.deleteSelectedItems('interactions');
    }
  });

  // Add click event listener for Delete Conversations Button
  deleteConversationsButton.addEventListener('click', async function () {
    if (
      window.confirm(
        'Are you sure you want to delete the selected conversations?'
      )
    ) {
      await utils.deleteSelectedItems('conversations');
    }
  });
}
