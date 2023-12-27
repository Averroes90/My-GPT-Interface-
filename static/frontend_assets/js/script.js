// Importing functions 
import * as api from './api.js';
import * as ui from './ui.js';
import * as utils from './utils.js';
//import '../../styles.css';


/*
function sendPrompt() {
  const promptElement = document.getElementById('userPrompt');
  const prompt = promptElement.value;
  const newConversationCheckbox = document.getElementById('newConversationCheckbox').checked; // Get the checkbox state
  const newConversationTitleElement = document.getElementById('newConversationTitle');
  const existingConversationTitleElement = document.getElementById('conversationTitleList');

  const newConversationTitle = newConversationCheckbox ? newConversationTitleElement.value.trim() : '';
  const existingConversationTitle = !newConversationCheckbox ? existingConversationTitleElement.options[existingConversationTitleElement.selectedIndex].text : '';

  //checks if the user opted to create a new conversation but left the conversation title box empty
  if (!ui.checkUserEntries()) {
    return; // Stop the function here if there was an error 
  }
  if (newConversationCheckbox) {
    ui.renderInteractions([]); // Clear the chat window
  }

  

  const modelName = "gpt-3.5-turbo";  // Hardcoded model name
  const tokenLimit = 4096;
  const tokenReserve = 0.10;
  api.sendPromptToBackend(prompt, newConversationCheckbox, newConversationTitle, existingConversationTitle, tokenLimit, tokenReserve, modelName)
  .then(data => {
      const interactionId = data.interactionId;  // Capture interaction ID here
      ui.displayUserMessage(interactionId, prompt);  // Display the user's message in the chat window amd Pass interaction ID
      ui.displayAIMessage(interactionId, data.response);       // Display GPT's response in the chat window and Pass interaction ID
      console.log('partition index:', data.truncationIndex);
      ui.renderTruncationPartition(data.truncationIndex); // Render the visual partition based on the truncation index
      ui.postResponseProcess(newConversationCheckbox, newConversationTitleElement); // Clear the textarea after sending and update checkbox and newconvotextbox appropriately 
  })
  .catch(error => {
    // Alert the user with the error message
    alert(error.message);
  });
} 

*/
/*
// Load conversation titles on page load
window.onload = async function() {

  await utils.loadConversationTitles();
  const newConversationCheckbox = document.getElementById('newConversationCheckbox');
  if (newConversationCheckbox.checked) {
    // No existing conversations, no need to fetch interactions
  } else {
    const conversationTitleList = document.getElementById('conversationTitleList');
    const selectedConversationSessionId = conversationTitleList.value; // Assuming the value is set to the conversationSessionId
    //console.log('conversation id:', selectedConversationSessionId);
    await api.fetchInteractions(selectedConversationSessionId)
      .then(interactions => {
        ui.renderInteractions(interactions);
      });
  }
 
  // Add a listener for changes to the checkbox
  newConversationCheckbox.addEventListener('change', function() {
    // Call your custom function to set the checkbox state and handle UI updates
    ui.setCheckboxState(this.checked);
  });

   // Add a listener for the submit button's click event
  document.querySelector('.ask-button').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the default form submission behavior
  sendPrompt();          // Call your sendPrompt function
});

  // Add listener to conversation title list
  conversationTitleList.addEventListener('change', function() {
    ui.refreshChatWindow();
  });
  // Modified: Event listener for deletion mode button
  document.getElementById('deletionModeButton').addEventListener('click', function() {
    ui.toggleDeletionMode();  // Existing function to toggle deletion mode
  
  });
  // Initialize Highlight.js
 // hljs.highlightAll();
 //

}
*/