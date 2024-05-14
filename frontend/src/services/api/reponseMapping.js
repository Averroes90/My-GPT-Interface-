import Joi from 'joi';
import * as commonSchema from './commonSchema';

const responseApiMappings = {
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
          .items(Joi.link('#conversationInfo'))
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
};
export default responseApiMappings;
