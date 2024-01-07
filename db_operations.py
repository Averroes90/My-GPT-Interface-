from models import Interaction, db, Conversation
from utils.utils import count_tokens

def store_interaction(conversation_session_id, prompt, response, model_name):
    """Store user interaction in the database."""
    
    # Count tokens for the combined prompt and response using the provided model name
    total_tokens = count_tokens(prompt + response, model_name)
    
    interaction = Interaction(
        conversation_session_id=conversation_session_id,
        prompt=prompt, response=response, 
        token_count=total_tokens, model_name=model_name
    )
    db.session.add(interaction)
    db.session.commit()
    return interaction.id  # Return the ID of the newly created interaction

def create_new_conversation(title):
    """Create a new conversation with the given title."""
    
    # Create a new Conversation object
    conversation = Conversation(title=title)
    db.session.add(conversation)
    db.session.commit()
    return conversation.conversation_session_id

def get_conversation_titles():
    """Retrieve all conversation titles from the database."""
    
    conversations = Conversation.query.all()
    has_conversations = len(conversations) > 0
    titles = [{'id': conv.conversation_session_id, 'name': conv.title} for conv in conversations]
    return titles, has_conversations

def conversation_title_exists(title):
    """Check if a conversation with the given title already exists."""
    
    return Conversation.query.filter(Conversation.title.ilike(title)).first() is not None

def get_conversation_by_title(title):
    """Retrieve the conversation's unique session ID based on the title."""
    
    # Query the database for the conversation with the given title
    conversation = Conversation.query.filter_by(title=title).first()

    # If conversation is found, return the session ID
    if conversation:
        return conversation.conversation_session_id

    # If conversation is not found, return None or raise an exception
    return None

def get_interactions_by_conversation(conversation_session_id):
    interactions = Interaction.query.filter_by(conversation_session_id=conversation_session_id).all()
    interactions_data = [
        {'id': interaction.id, 'prompt': interaction.prompt, 'response': interaction.response} 
        for interaction in interactions
    ]
    return interactions_data

def delete_interactions(ids):
    try:
        for id in ids:
            interaction = Interaction.query.get(id)
            if interaction is None:
                print(f"id {id} not in database")
                
        Interaction.query.filter(Interaction.id.in_(ids)).delete(synchronize_session='fetch')
        db.session.commit()
        print(f"interactions deleted successfully from within db_operations")
        return True
    except Exception as e:
        print(f"Error deleting interactions: {e}")
        return False

def delete_conversations(ids):
    try:
        # First, delete all interactions associated with the conversations to be deleted
        Interaction.query.filter(Interaction.conversation_session_id.in_(ids)).delete(synchronize_session='fetch')

        # Then, delete the conversations themselves
        Conversation.query.filter(Conversation.conversation_session_id.in_(ids)).delete(synchronize_session='fetch')

        db.session.commit()
        return True
    except Exception as e:
        print(f"Error deleting conversations and associated interactions: {e}")
        return False