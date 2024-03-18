import os
from dotenv import load_dotenv
from openai import AsyncOpenAI
from config import settings

load_dotenv()  # Load the .env file

async def generate_text(messages: list[dict[str, str]], 
                        model_name: str = "gpt-4-1106-preview", 
                        reserved_tokens: int = 300) -> str:
    """Generate a response from OpenAI API asynchronously."""

    client = AsyncOpenAI(
        api_key=settings.openai_api_key
    )

    chat_completion = await client.chat.completions.create(
        model=model_name,
        messages=messages,  # Pass the messages directly
        max_tokens=reserved_tokens
    )
    print(f'chat completion {chat_completion}')
    response_text = chat_completion.choices[0].message.content if chat_completion.choices else "No response generated."

    # completion_tokens = chat_completion.usage.completion_tokens
    # prompt_tokens = chat_completion.usage.prompt_tokens
    # total_tokens = chat_completion.usage.total_tokens

    return response_text#, completion_tokens, prompt_tokens, total_tokens