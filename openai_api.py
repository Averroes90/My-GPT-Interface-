import openai
import os
from dotenv import load_dotenv
from utils.utils import count_tokens


load_dotenv()  # Load the .env file

def generate_text(messages, model_name="gpt-3.5-turbo", reserved_tokens=300):
    """Generate a response from OpenAI API."""
    
    openai_api_key = os.getenv("OPENAI_API_KEY")  # Retrieve the API key from environment variable
    openai.api_key = openai_api_key
    
    model_name = "gpt-3.5-turbo"

  #  additional_tokens = 0
   # for msg in messages:
   #   if msg["role"] == "user":
   #     additional_tokens += count_tokens('"role": "user", "content":', model_name)
   #   else:
   #     additional_tokens += count_tokens('"role": "assistant", "content":', model_name)

    #total_tokens_with_additional = total_tokens + additional_tokens
   # print("Additional Tokens:", additional_tokens)
    #print("Total Tokens with Additional:", total_tokens_with_additional)
    response_data = openai.ChatCompletion.create(
      model=model_name,
      #messages=[{"role": "user", "content": prompt}],
      messages=messages,  # Pass the messages directly
      max_tokens=reserved_tokens
    )
    
    response_text = response_data['choices'][0]['message']['content']
    
    return response_text # Return the response 