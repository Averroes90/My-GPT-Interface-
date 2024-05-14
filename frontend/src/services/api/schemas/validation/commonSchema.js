import Joi from 'joi';

export const tokenSchema = Joi.number().integer();
export const promptSchema = Joi.string();
export const responseSchema = Joi.string();
export const conversationSessionIdSchema = Joi.string();
export const interactionSessionIdSchema = Joi.string();
export const conversationTitleSchema = Joi.string();
export const selectedInteractionsSessionIds = Joi.array().items(
  interactionSessionIdSchema
);

export const ConversationInfoSchema = {
  conversation_session_id: conversationSessionIdSchema.required(),
  title: conversationTitleSchema.required(),
};
