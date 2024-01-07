from flask_sqlalchemy import SQLAlchemy
import uuid
from datetime import datetime

db = SQLAlchemy()

def generate_uuid():
    return str(uuid.uuid4())

class Conversation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), unique=True, nullable=False)  # Unique conversation title
    conversation_session_id = db.Column(db.String(36), unique=True, nullable=False, default=generate_uuid)  # Unique ID for each conversation

class Interaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    interaction_session_id = db.Column(db.String(36), nullable=False, default=generate_uuid) # Unique for each interaction
    conversation_session_id = db.Column(db.String(36), nullable=False) # Same for all interactions in a conversation
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    prompt = db.Column(db.String(8192), nullable=False)
    response = db.Column(db.String(8192), nullable=False)
    token_count = db.Column(db.Integer, nullable=False)
    model_name = db.Column(db.String(256), nullable=False)  # New field to store the model name
    # Additional fields can be added in the future, e.g., sentiment