import Joi from 'joi';
import * as commonSchema from './commonSchema';

const responseApiMappings = {
  interaction: {
    mappings: {
      id: {
        backend: 'id',
        frontend: 'id',
        validation: Joi.number().required(),
      },
      prompt: {
        backend: 'prompt',
        frontend: 'prompt',
        validation: commonSchema.promptSchema.required(),
      },
      timestamp: {
        backend: 'timestamp',
        frontend: 'timestamp',
        validation: Joi.date().iso().required(),
      },
      response: {
        backend: 'response',
        frontend: 'response',
        validation: commonSchema.responseSchema.required(),
      },
      promptTokenCount: {
        backend: 'prompt_token_count',
        frontend: 'promptTokenCount',
        validation: commonSchema.tokenSchema.required(),
      },
      responseTokenCount: {
        backend: 'response_token_count',
        frontend: 'responseTokenCount',
        validation: commonSchema.tokenSchema.required(),
      },
      tokenCount: {
        backend: 'token_count',
        frontend: 'tokenCount',
        validation: commonSchema.tokenSchema.required(),
      },
      interactionSessionId: {
        backend: 'interaction_session_id',
        frontend: 'interactionSessionId',
        validation: commonSchema.interactionSessionIdSchema.required(),
      },
      conversationSessionId: {
        backend: 'conversation_session_id',
        frontend: 'conversationSessionId',
        validation: commonSchema.conversationSessionIdSchema.required(),
      },
    },
  },
  conversationWIthInteractions: {
    mappings: {
      interactions: {
        backend: 'interactions',
        frontend: 'interactions',
        validation: Joi.array().items(Joi.link('#interaction')).required(),
      },
      totalTokens: {
        backend: 'total_tokens',
        frontend: 'totalTokens',
        validation: commonSchema.tokenSchema.required(),
      },
    },
  },
  sendPromptToBackend: {
    mappings: {
      response: {
        backend: 'response',
        frontend: 'response',
        validation: commonSchema.responseSchema.required(),
      },
      truncationIndex: {
        backend: 'truncation_index',
        frontend: 'truncationIndex',
        validation: Joi.number().integer().required(),
      },
      interactionSessionId: {
        backend: 'interaction_session_id',
        frontend: 'interactionSessionId',
        validation: commonSchema.interactionSessionIdSchema.required(),
      },
      conversationSessionId: {
        backend: 'conversation_session_id',
        frontend: 'conversationSessionId',
        validation: commonSchema.conversationSessionIdSchema.required(),
      },
      promptTokenCount: {
        backend: 'prompt_token_count',
        frontend: 'promptTokenCount',
        validation: commonSchema.tokenSchema.required(),
      },
      responseTokenCount: {
        backend: 'response_token_count',
        frontend: 'responseTokenCount',
        validation: commonSchema.tokenSchema.required(),
      },
      contextTokenCount: {
        backend: 'context_token_count',
        frontend: 'contextTokenCount',
        validation: commonSchema.tokenSchema.required(),
      },
    },
  },
  conversationInfo: {
    mappings: {
      conversationSessionId: {
        backend: 'conversation_session_id',
        frontend: 'conversationSessionId',
        validation: commonSchema.conversationSessionIdSchema.required(),
      },
      title: {
        backend: 'title',
        frontend: 'title',
        validation: commonSchema.conversationTitleSchema.required(),
      },
    },
  },
  getConversationTitles: {
    mappings: {
      conversationList: {
        backend: 'conversation_list',
        frontend: 'conversationList',
        validation: Joi.array()
          .items(Joi.object(commonSchema.ConversationInfoSchema).required())
          .required()
          .options({ allowUnknown: true }),
      },
      hasConversations: {
        backend: 'has_conversations',
        frontend: 'hasConversations',
        validation: Joi.boolean().required(),
      },
      selectedConversationID: {
        backend: 'selected_conversation_id',
        frontend: 'selectedConversationId',
        validation: commonSchema.conversationSessionIdSchema,
      },
    },
  },
  deleteItemsResponse: {
    mappings: {
      success: {
        backend: 'success',
        frontend: 'success',
        validation: Joi.boolean().required(),
      },
      message: {
        backend: 'message',
        frontend: 'message',
        validation: Joi.string().required(),
      },
    },
  },
};
export default responseApiMappings;
