import Joi from 'joi';
import * as commonSchema from '../../dataIntegration/commonSchema';

const requestApiMappings = {
  sendPromptToBackend: {
    mappings: {
      prompt: {
        backend: 'prompt',
        frontend: 'prompt',
        validation: Joi.string().required(),
      },
      newConversationCheckbox: {
        backend: 'new_conversation_checkbox',
        frontend: 'newConversationCheckbox',
        validation: Joi.boolean().required(),
      },
      newConversationTitle: {
        backend: 'new_conversation_title',
        frontend: 'newConversationTitle',
        validation: commonSchema.conversationTitleSchema.required(),
      },
      conversationSessionId: {
        backend: 'conversation_session_id',
        frontend: 'conversationSessionId',
        validation: commonSchema.conversationSessionIdSchema.required(),
      },
      tokenLimit: {
        backend: 'token_limit',
        frontend: 'tokenLimit',
        validation: commonSchema.tokenSchema.required(),
      },
      tokenReserve: {
        backend: 'token_reserve',
        frontend: 'tokenReserve',
        validation: commonSchema.tokenSchema.required(),
      },
      modelName: {
        backend: 'model_name',
        frontend: 'modelName',
        validation: Joi.string().required(),
      },
    },
  },
  conversationById: {
    mappings: {
      conversationSessionId: {
        backend: 'conversation_session_id',
        frontend: 'conversationSessionId',
        validation: commonSchema.conversationSessionIdSchema.required(),
      },
      modelName: {
        backend: 'model_name',
        frontend: 'modelName',
        validation: Joi.string().required(),
      },
    },
  },
  deleteItemsRequest: {
    mappings: {
      type: {
        backend: 'type',
        frontend: 'type',
        validation: Joi.string().required(),
      },
      ids: {
        backend: 'ids',
        frontend: 'selectedIds',
        validation: commonSchema.selectedInteractionsSessionIds.required(),
      },
    },
  },
  popInteractions: {
    mappings: {
      newConversationTitle: {
        backend: 'new_conversation_title',
        frontend: 'newConversationTitle',
        validation: commonSchema.conversationTitleSchema.required(),
      },
      selectedIds: {
        backend: 'ids',
        frontend: 'selectedIds',
        validation: commonSchema.selectedInteractionsSessionIds.required(),
      },
    },
  },
};
export default requestApiMappings;
