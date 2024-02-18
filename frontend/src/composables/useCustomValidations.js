import { useNotifications } from './useNotifications';

export function useTokenValidation(maxtokens, mintokens, maxAllowedTokens) {
  const isValidToken = () => {
    const { addNotification } = useNotifications();
    if (!/^\s*\d+\s*$/.test(maxtokens.value)) {
      addNotification(
        'Max tokens must be a whole number without letters or special characters.',
        'error-message'
      );
      return false;
    }

    const maxTokensValue = parseInt(maxtokens.value, 10);

    if (
      isNaN(maxTokensValue) ||
      maxTokensValue < mintokens ||
      maxTokensValue > maxAllowedTokens
    ) {
      const errorMessage = `Max tokens must be an integer between ${mintokens} and ${maxAllowedTokens}.`;
      addNotification(errorMessage, 'error-message');
      return false;
    }

    return true;
  };

  return {
    isValidToken,
  };
}

export function useConversationValidation(
  newConversationCheckboxState,
  newConversationTitle
) {
  const isValidNewConversation = () => {
    const { addNotification } = useNotifications();
    const trimmedTitle = newConversationCheckboxState.value
      ? newConversationTitle.value.trim()
      : '';

    if (newConversationCheckboxState.value && trimmedTitle === '') {
      const errorMessage =
        'New Conversation Title cannot be empty when "New Conversation" is checked.';
      addNotification(errorMessage, 'error-message');
      return false;
    }
    return true;
  };

  return {
    isValidNewConversation,
  };
}
