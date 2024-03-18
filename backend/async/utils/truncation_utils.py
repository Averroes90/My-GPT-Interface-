from adapters import aimodeladapter as AIModelHandler
from schemas.schemas import ConversationExtended, InteractionCreate


async def truncate_and_format_interactions(
    conversation: ConversationExtended,
    prompt_data: InteractionCreate,
    model_handler: AIModelHandler,
) -> list[dict[str, str]]:
    # interactions, current_model_name, token_limit, reserved_tokens, user_role_tokens, assistant_role_tokens
    interactions = [
        interaction.model_dump() for interaction in conversation.interactions
    ]
    interactions.append({"prompt": prompt_data.prompt})
    token_limit = prompt_data.token_limit
    reserved_tokens = prompt_data.token_reserve
    context_interactions = []
    total_tokens = 0
    remaining_tokens = token_limit - reserved_tokens
    truncation_index = -1  # Initialize the index to indicate no truncation
    interaction_response = None
    # Calculate the additional tokens for user and assistant role patterns
    # user_role_tokens = count_tokens('"role": "user", "content":', current_model_name)
    # assistant_role_tokens = count_tokens('"role": "assistant", "content":', current_model_name)
    for idx, interaction_ in enumerate(reversed(interactions)):
        model_handler.format_prompt(interaction_["prompt"])
        interaction_prompt = model_handler.prompt_message
        prompt_tokens = model_handler.prompt_token_count
        if "response" in interaction_:
            model_handler.format_response(interaction_["response"])
            interaction_response = model_handler.response_message
            response_tokens = model_handler.response_token_count
        else:
            response_tokens = 0
        interaction_token_count = prompt_tokens + response_tokens
        if total_tokens + interaction_token_count <= remaining_tokens:
            if (
                interaction_response is not None
            ):  # Only append if interaction_response has been set
                context_interactions.append(interaction_response)
            context_interactions.append(interaction_prompt)
            total_tokens += interaction_token_count
        else:
            truncation_index = (
                len(interactions) - idx
            )  # Save the index where the truncation occurred
            break
        prompt_data.truncation_index = truncation_index
        prompt_data.context_token_count = model_handler.count_tokens(prompt_data.prompt)
        prompt_data.prompt_token_count = prompt_tokens
    return list(reversed(context_interactions))
