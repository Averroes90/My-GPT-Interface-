import tiktoken
from openai import OpenAIError as OpenAIApiError

def count_tokens(text, model_name):
    try:
        # Retrieve the encoding for the given model
        encoding = tiktoken.encoding_for_model(model_name)
        return len(encoding.encode(text))
    except OpenAIApiError as e:
        # Handle the error, maybe log it
        return 0

def add_role_tag_token_counts(interactions, user_role_tag_tokens, assitant_role_tag_tokens):
    for interaction in interactions:
        interaction['prompt_token_count'] += user_role_tag_tokens
        interaction['response_token_count'] += assitant_role_tag_tokens
        interaction['token_count'] += (user_role_tag_tokens+assitant_role_tag_tokens) 
    return interactions
