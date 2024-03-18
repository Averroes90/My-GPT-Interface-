import os
from pydantic_settings import BaseSettings  

class Settings(BaseSettings):
    openai_api_key: str
    database_url: str
    debug: bool = False  # Example of non-sensitive default
    
    class Config:
         env_file = f".env.{os.getenv('FASTAPI_ENV', 'dev')}"

settings = Settings()