from models import Interaction, db, Conversation
from utils.utils import count_tokens
import uuid
from datetime import datetime

def store_interaction(conversation_session_id, prompt, response, model_name):
    """Store user interaction in the database."""
    
    # Count tokens for the combined prompt and response using the provided model name
    prompt_tokens = count_tokens(prompt,model_name)
    response_tokens = count_tokens(response,model_name)   
    total_tokens = prompt_tokens + response_tokens
    
    interaction = Interaction(
        conversation_session_id=conversation_session_id,
        prompt=prompt, 
        response=response, 
        prompt_token_count = prompt_tokens,
        response_token_count = response_tokens,
        token_count=total_tokens, 
        model_name=model_name,
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
    """Retrieve all conversation titles and the selected conversation id from the database.
       The selected conversation id will be the one with the latest interaction date.
    """

    # Retrieve all the conversation titles
    conversations = Conversation.query.all()
    has_conversations = len(conversations) > 0

    # Find the conversation with the latest interaction
    latest_interaction = Interaction.query.order_by(Interaction.timestamp.desc()).first()

    # Get the associated conversation_session_id or None if no conversations are available
    selected_conversation_id = latest_interaction.conversation_session_id if latest_interaction else None

    titles = [
        {
            'id': conv.conversation_session_id,
            'name': conv.title
        }
        for conv in conversations
    ]
    return titles, has_conversations, selected_conversation_id

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
        {'id': interaction.id, 
         'prompt': interaction.prompt, 
         'timestamp': interaction.timestamp,
         'response': interaction.response,
         'prompt_tokens':interaction.prompt_token_count,
         'response_tokens':interaction.response_token_count,
         'total_tokens':interaction.token_count,
         'interaction_session_id':interaction.interaction_session_id} 
        for interaction in interactions
    ]
    sorted_interactions = sorted(interactions_data, key=lambda x: x['id'])
    return sorted_interactions

def delete_interactions(ids):
    try:
        interactions = get_interactions_by_ids(ids)
        retrieved_ids = set()
        retrieved_ids = {interaction['interaction_session_id'] for interaction in interactions}
        missing_ids = set(ids) - retrieved_ids
        if missing_ids:
            print(f"These IDs were not found in the database: {missing_ids}")              
        try: 
            Interaction.query.filter(Interaction.interaction_session_id.in_(ids)).delete(synchronize_session='fetch')
            db.session.commit()
            print(f"interactions deleted successfully from within db_operations")
            return True
        except Exception as e:
            print(f"Error deleting interactions: {e}")
            return False
    except Exception as e:
        print(f"Error finding interactions: {e}")
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
    
def pop_interactions(ids, new_conversation_title):
    try:
        interactions = get_interactions_by_ids(ids)
        retrieved_ids = set()
        sorted_interactions = sorted(interactions, key=lambda x: x['id'])
        # Add the ID to the set of retrieved IDs
        retrieved_ids = {interaction['interaction_session_id'] for interaction in interactions}
        missing_ids = set(ids) - retrieved_ids
        if missing_ids:
            print(f"These IDs were not found in the database: {missing_ids}")
        try:
            conversation_session_id = create_new_conversation(new_conversation_title)
            store_interactions(sorted_interactions, conversation_session_id)
        except Exception as e:
            print(f"Error storing interactions: {e}")
            return False
        print(f"interactions popped successfully from within db_operations")
        return True
    except Exception as e:
        print(f"Error finding interactions: {e}")
        return False
    

def get_interactions_by_ids(interaction_ids):
    """
    Retrieve interactions by a list of interaction IDs.

    :param interaction_ids: List of interaction IDs
    :return: List of interactions with specified IDs
    """
    interactions = Interaction.query.filter(Interaction.interaction_session_id.in_(interaction_ids)).all()

    return [{
        'id': interaction.id,
        'interaction_session_id': interaction.interaction_session_id,
        'conversation_session_id': interaction.conversation_session_id,
        'timestamp': interaction.timestamp,
        'prompt': interaction.prompt,
        'response': interaction.response,
        'token_count': interaction.token_count,
        'prompt_token_count': interaction.prompt_token_count,
        'response_token_count': interaction.response_token_count,
        'model_name': interaction.model_name
    } for interaction in interactions]

def store_interactions(interactions_data, conversation_session_id):
    """
    Store a list of interactions with a common conversation ID.

    :param interactions_data: List of interaction data dictionaries
    :param conversation_session_id: Common conversation session ID for all interactions
    """
    new_interactions = []

    for data in interactions_data:
        new_interaction = Interaction(
            interaction_session_id=str(uuid.uuid4()),
            conversation_session_id=conversation_session_id,
            timestamp=datetime.utcnow(),
            prompt=data['prompt'],
            response=data['response'],
            token_count=data['token_count'],
            prompt_token_count=data['prompt_token_count'],
            response_token_count=data['response_token_count'],
            model_name=data['model_name'],
        )
        new_interactions.append(new_interaction)

    db.session.add_all(new_interactions)
    db.session.commit()

