from models.models import Interaction, Conversation
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import desc
from schemas.schemas import ConversationExtended, InteractionDBWrite, ConversationBase, ConversationList, ConversationCreate



async def fetch_conversations(session: AsyncSession) -> ConversationList:
    stmt_conversations = select(Conversation)
    result_conversations = await session.execute(stmt_conversations)
    conversations = result_conversations.scalars().all()
    conversations_base_list = [ConversationBase.model_validate(conversation) for conversation in conversations]
    stmt_latest_interaction = (
        select(Interaction.conversation_session_id)
        .order_by(desc(Interaction.timestamp))
        .limit(1)
    )
    result_latest = await session.execute(stmt_latest_interaction)
    selected_conversation_id = result_latest.scalars().first()
    
    
    conversation_list_model = ConversationList.model_validate({
        "conversation_list": conversations_base_list,
        "selected_conversation_id": selected_conversation_id,
        # "has_conversations" dynamically inferred or can be explicitly set based on the list
    })
    
    return conversation_list_model


async def create_new_conversation_async( session: AsyncSession , title: str) -> ConversationCreate:
    conversation_orm = Conversation(title=title)  # Assuming 'Conversation' is your SQLAlchemy model
    session.add(conversation_orm)
    await session.flush()  # Flush to obtain generated IDs, but not commit the transaction.
    conversation_orm.interactions = []
    conversation_extended = ConversationCreate.model_validate(conversation_orm)
    conversation_extended.orm_model = conversation_orm
    return conversation_extended


async def fetch_conversation_with_interactions(session: AsyncSession, 
                                               conversation_session_id: str
                                               ) -> Optional[ConversationExtended]:
    stmt = (
        select(Conversation)
        .options(selectinload(Conversation.interactions))
        .where(Conversation.conversation_session_id == conversation_session_id)
    )
    result = await session.execute(stmt)
    conversation_orm = result.scalars().first()

    if conversation_orm:
        # interactions_extended = [InteractionDBRead.model_validate(interaction) for interaction in conversation.interactions]
        conversation_extended = ConversationExtended.model_validate(conversation_orm)
        conversation_extended.orm_model = conversation_orm
        # conversation_extended.interactions = interactions_extended
        return conversation_extended
    return None

async def store_new_interaction(session: AsyncSession, 
                                conversation: ConversationExtended, 
                                interaction_data: InteractionDBWrite) -> str:
    interaction_orm = Interaction(**interaction_data.model_dump())
    conversation.orm_model.interactions.append(interaction_orm)
    await session.commit()
    await session.refresh(interaction_orm)
    return interaction_orm.interaction_session_id