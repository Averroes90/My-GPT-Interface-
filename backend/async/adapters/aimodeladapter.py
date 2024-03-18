from utils.utils import count_tokens as ct
from typing import Protocol, runtime_checkable
from openai_api import generate_text

@runtime_checkable
class AIModelHandler(Protocol):
    def format_prompt(self, prompt_content: str) -> dict:
        """Formats the prompt content into a specific structure required by the AI model."""
        ...

    def format_response(self, response_content: str) -> dict:
        """Formats the response content from the AI model into a more usable structure."""
        ...

    def count_tokens(self, content: str) -> int:
        """Counts the number of tokens in the input content using a model-specific approach."""
        ...

    async def generate_text(self, message, max_tokens: int, model_name: str = None)->str:
        """generates an AI completion"""
        ...

class OpenAIHandler():
    role_key = "role"
    user_key = "user"
    content_key = "content"
    assistant_key = "assistant"

    def __init__(self, model_name= None):
        self.prompt_message = None
        self.prompt_token_count = 0
        self.response_message = None
        self.response_token_count = 0
        self.model_name = model_name

    def format_prompt(self, prompt_content: str):
        self.prompt_message = {
            self.role_key: self.user_key,
            self.content_key: prompt_content
        }
        self.prompt_token_count = self.count_tokens(f"{self.role_key} {self.user_key} {self.content_key} {prompt_content}")

    def format_response(self, response_content: str):
        self.response_message = {
            self.role_key: self.assistant_key,
            self.content_key: response_content
        }
        self.response_token_count = self.count_tokens(f"{self.role_key} {self.assistant_key} {self.content_key} {response_content}")

    def count_tokens(self, content: str) -> int:
        return ct(content,self.model_name)
    
    async def generate_text(self, message, max_tokens: int, model_name: str = None)->str:
        if model_name is None:
            model_name = self.model_name
        return  await generate_text(message,model_name, max_tokens )


def get_ai_model_handler(model_name: str) -> AIModelHandler:
    if model_name == "gpt-4-turbo-preview":
        return OpenAIHandler(model_name)
    # Add other conditions for different handlers
    else:
        raise ValueError(f"Unsupported model: {model_name}")