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