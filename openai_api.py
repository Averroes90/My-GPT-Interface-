import openai
import os
from dotenv import load_dotenv
from utils.utils import count_tokens


load_dotenv()  # Load the .env file

def generate_text(messages, model_name="gpt-4-1106-preview", reserved_tokens=300):
    """Generate a response from OpenAI API."""
    
    openai_api_key = os.getenv("OPENAI_API_KEY")  # Retrieve the API key from environment variable
    openai.api_key = openai_api_key
    
    model_name = "gpt-4-1106-preview"

    response_data = openai.ChatCompletion.create(
      model=model_name,
      #messages=[{"role": "user", "content": prompt}],
      messages=messages,  # Pass the messages directly
      max_tokens=reserved_tokens
    )
    
    response_text = response_data['choices'][0]['message']['content']
    
    return response_text # Return the response 