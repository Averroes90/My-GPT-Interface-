from utils.utils import count_tokens

def truncate_interactions(interactions, current_model_name, token_limit, reserved_tokens, user_role_tokens, assistant_role_tokens):
    context_data = []
    total_tokens = 0
    remaining_tokens = token_limit - reserved_tokens
    truncation_index = -1 # Initialize the index to indicate no truncation

    #Calculate the additional tokens for user and assistant role patterns
    # user_role_tokens = count_tokens('"role": "user", "content":', current_model_name)
    # assistant_role_tokens = count_tokens('"role": "assistant", "content":', current_model_name)

    for idx, interaction in enumerate(reversed(interactions)):
        prompt_tokens = count_tokens(interaction['prompt'], current_model_name) + user_role_tokens 
        response_tokens = count_tokens(interaction['response'], current_model_name) + assistant_role_tokens if interaction['response'] else 0
        interaction_token_count = prompt_tokens + response_tokens

        if total_tokens + interaction_token_count <= remaining_tokens:
            context_data.append(interaction)
            total_tokens += interaction_token_count
            
        else:
            truncation_index = len(interactions) - idx # Save the index where the truncation occurred
            break

    return list(reversed(context_data)),truncation_index, total_tokens


def basic_truncate(text, max_tokens=4096):
    """Basic truncation to keep the text within a certain token limit."""
    while count_tokens(text) > max_tokens:
        text = text.split(' ', 1)[1] # Remove one word at a time
    return text