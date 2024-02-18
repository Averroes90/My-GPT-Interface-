from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS, cross_origin
from flask_migrate import Migrate
import os
import asyncio
from models.models import db, Interaction, Conversation
from config import config
from db_operations import store_interaction, create_new_conversation, get_conversation_by_title, get_interactions_by_conversation
from db_operations import delete_interactions, delete_conversations, conversation_title_exists, get_conversation_titles, pop_interactions
from openai_api import generate_text
from utils.truncation_utils import truncate_interactions
from utils.utils import count_tokens, add_role_tag_token_counts

import uuid
from dotenv import load_dotenv  # <-- Import load_dotenv
from utils.utils import count_tokens
import math

load_dotenv()  # <-- Load environment variables from .env file

app = Flask(__name__)
app.config.from_object(config[os.getenv('FLASK_ENV', 'default')])
print("Debug Mode (Config):", app.config['DEBUG'])

app.secret_key = os.getenv('FLASK_SECRET_KEY')  # <-- Set the secret key from .env
db.init_app(app)

print("FLASK_ENV:", os.getenv('FLASK_ENV'))
# Integrate Flask-Migrate
migrate = Migrate(app, db)

CORS(app, origins=["http://localhost:8080"])

# @app.route('/')
# def home():
#     return render_template('index.html')

@app.route('/api/get_conversation_titles', methods=['GET'])
def fetch_conversation_titles():
    titles, has_conversations,selected_conversation_id  = get_conversation_titles()
    return jsonify({'titles': titles, 
                    'has_conversations': has_conversations,
                    'selected_conversation_id':selected_conversation_id})

@app.route('/api/get_interactions/<conversation_session_id>', methods=['GET'])
def fetch_interactions(conversation_session_id):
    model_name = request.args.get('model')
    interactions = get_interactions_by_conversation(conversation_session_id)

    #Calculate the additional tokens for user and assistant role patterns
    user_role_tokens = count_tokens('"role": "user", "content":', model_name)
    assistant_role_tokens = count_tokens('"role": "assistant", "content":', model_name)
    role_tagged_interactions = add_role_tag_token_counts(interactions, user_role_tokens, assistant_role_tokens)
    # Calculate the sum of total_tokens for all interactions
    total_tokens_sum = sum(interaction['total_tokens'] for interaction in role_tagged_interactions)
    total_response_tokens = sum(interaction['response_tokens'] for interaction in role_tagged_interactions)
    print(f'total response tokens........ {total_response_tokens}')
    # Return the interactions and the sum of total_tokens
    return jsonify({
        'interactions': role_tagged_interactions,
        'total_tokens': total_tokens_sum})

@app.route('/api/delete/<itemType>', methods=['DELETE'])
def delete_items(itemType):
    itemIds = request.json.get('ids', [])
    # Log incoming data for debugging
    print(f"Received itemType: {itemType}")
    print(f"Received itemIds: {itemIds}")
    
    if not itemIds:
        return jsonify({'success': False, 'message': 'No IDs provided'}), 400
    
    if itemType == 'interactions':
        success = delete_interactions(itemIds)  # Implement this function in db_operations.py
    elif itemType == 'conversations':
        success = delete_conversations(itemIds)  # Implement this function in db_operations.py
    else:
        return jsonify({'success': False, 'message': 'Invalid item type'}), 400
    
    if success:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': 'Deletion failed'}), 500

@app.route('/api/prompt', methods=['POST'])
def handle_prompt():
    data = request.json
    prompt_content = data.get('prompt')
    model_name = data.get('modelName')  # Get the model name from request data
    conversation_session_id = data.get('existingConversationTitle')
    new_conversation_title = data.get('newConversationTitle')
    new_conversation_checkbox = data.get('newConversationCheckbox') 
    token_limit = data.get('tokenLimit') #total token limits for the model 
    token_reserve = data.get('tokenReserve') #tokens reserved for new user's prompt in %
    #reserved_tokens = math.floor(token_limit * token_reserve)
    if not isinstance(token_reserve, int):
        return jsonify({'error': 'maxtokens expected an integer but got a string'}), 400
    reserved_tokens = token_reserve
    message = []

    #Calculate the additional tokens for user and assistant role patterns
    user_role_tokens = count_tokens('"role": "user", "content":', model_name)
    assistant_role_tokens = count_tokens('"role": "assistant", "content":', model_name)
    prompt_tokens = count_tokens(prompt_content, model_name) + user_role_tokens
    if new_conversation_checkbox:
        new_conversation_title = new_conversation_title.strip() if new_conversation_title else None #trim whitespaces before/after
        if not conversation_title_exists(new_conversation_title):
            #following order of response first then create new convo is necessary
            #to avoice catastrophic error
            truncation_index = -1  # Initialize to -1 to indicate no truncation
            message.append({"role": "user", "content": prompt_content})
            # Generate response using the formatted message and model name
            response = asyncio.run(generate_text(message, model_name, reserved_tokens))  # Only receiving the response text
            conversation_session_id = create_new_conversation(new_conversation_title)
            response_tokens = count_tokens(response, model_name) + assistant_role_tokens
            interactions_total_tokens = prompt_tokens + response_tokens       
        else:
            return jsonify({'error': 'The conversation title already exists'}), 400
    else:
        interactions = get_interactions_by_conversation(conversation_session_id)

        # Add the user's current prompt to interactions
        interactions.append({'prompt': prompt_content, 'response': ''})

        # Truncate interactions to fit within the token limit
        #context_data, truncation_index = truncate_interactions(interactions, model_name, token_limit, reserved_tokens)
        #return list(reversed(context_data)), list(reversed(token_counts)),truncation_index, total_tokens
        context_data, truncation_index, context_total_tokens = truncate_interactions(interactions, model_name, token_limit, reserved_tokens, user_role_tokens, assistant_role_tokens)


        for interaction in context_data:
            message.append({"role": "user", "content": interaction['prompt']})
            message.append({"role": "assistant", "content": interaction['response']})
        # Generate response using the formatted message and model name
        response = asyncio.run(generate_text(message, model_name, reserved_tokens))  # Only receiving the response text
        response_tokens = count_tokens(response, model_name) +assistant_role_tokens 
        interactions_total_tokens = context_total_tokens + response_tokens
        # Store the token counts for the latest response
    

    # Store the interaction in the database
    interaction_id = store_interaction(conversation_session_id, prompt_content, response, model_name)
    return jsonify({
        'response': response, 
        'truncationIndex': truncation_index, 
        'interactionId': interaction_id, 
        'conversationId': conversation_session_id,
        'prompt_tokens': prompt_tokens,
        'response_tokens': response_tokens,
        'context_total_tokens': interactions_total_tokens,
        })
    
@app.route('/api/popinteractions/', methods=['POST'])
def pop_items():
    data = request.json
    interactionsIds = data.get('ids', [])
    new_conversation_title = data.get('newConversationTitle')
    new_conversation_title = new_conversation_title.strip() if new_conversation_title else None
    if not conversation_title_exists(new_conversation_title):
        # Log incoming data for debugging
        print(f"Received interactionsIds: {interactionsIds}")
    
        if not interactionsIds:
            return jsonify({'success': False, 'message': 'No IDs provided'}), 400
        success = pop_interactions(interactionsIds,new_conversation_title)  # Implement this function in db_operations.py
 
        if success:
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': 'Pop failed'}), 500
    else:
        return jsonify({'error': 'The conversation title already exists'}), 400

if __name__ == '__main__':
    app.run(debug=True)