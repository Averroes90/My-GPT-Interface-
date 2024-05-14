from typing import Union
from models.models import Interaction, Conversation
from typing import Optional
from sqlalchemy import desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload, Session
from schemas.schemas import (
    ConversationExtended,
    InteractionDBRead,
    InteractionDBWrite,
    ConversationBase,
    ConversationList,
    ConversationCreate,
)
from abc import ABC, abstractmethod


class ConversationRepositoryBase(ABC):

    @abstractmethod
    def fetch_conversations(self) -> list[Conversation]:
        pass

    @abstractmethod
    def fetch_selected_conversation_session_id(self) -> str:
        pass

    @abstractmethod
    def create_new_conversation_store_interaction(self, title: str) -> Conversation:
        pass

    @abstractmethod
    def fetch_conversation_with_interactions(
        self, conversation_session_id: str
    ) -> Optional[Conversation]:
        pass

    @abstractmethod
    def store_new_interaction(
        self, conversation_orm: Conversation, interaction_data: InteractionDBWrite
    ) -> str:
        pass


class ConversationRepositoryAsync(ConversationRepositoryBase):
    def __init__(self, session) -> None:
        self.session = session

    async def fetch_conversations(self) -> list[Conversation]:
        stmt = select(Conversation)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def fetch_selected_conversation_session_id(self) -> str:
        stmt_latest_interaction = (
            select(Interaction.conversation_session_id)
            .order_by(desc(Interaction.timestamp))
            .limit(1)
        )
        result = await self.session.execute(stmt_latest_interaction)
        return result.scalars().first()

    async def create_new_conversation_store_interaction(
        self,
        conversation_extended: ConversationCreate,
        interaction_data: InteractionDBWrite,
    ) -> str:
        interaction_orm = Interaction(**interaction_data.model_dump())
        conversation_orm = Conversation(**conversation_extended.model_dump())
        conversation_orm.interactions.append(interaction_orm)
        self.session.add(conversation_orm)
        return conversation_orm

    async def fetch_conversation_with_interactions(
        self, conversation_session_id: str
    ) -> Optional[Conversation]:
        stmt = (
            select(Conversation)
            .options(selectinload(Conversation.interactions))
            .where(Conversation.conversation_session_id == conversation_session_id)
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def store_new_interaction(
        self,
        conversation_extended: ConversationExtended,
        interaction_data: InteractionDBWrite,
    ) -> str:
        conversation_orm = conversation_extended.orm_model
        interaction_orm = Interaction(**interaction_data.model_dump())
        conversation_orm.interactions.append(interaction_orm)
        return conversation_orm


# class ConversationRepositorySyncAdapter(ConversationRepositoryBase):
#     def __init__(self, sync_conv_rep) -> None:
#         self.sync_conv_rep = sync_conv_rep

#     async def fetch_conversations(self) -> list[Conversation]:
#         return self.sync_conv_rep.fetch_conversations()

#     async def create_new_conversation(self, title: str) -> Conversation:
#         return self.sync_conv_rep.create_new_conversation(title)

#     async def fetch_conversation_with_interactions(self, conversation_session_id: str) -> Optional[Conversation]:
#         return self.sync_conv_rep.fetch_conversation_with_interactions(conversation_session_id)

#     async def store_new_interaction(self, conversation_orm: Conversation, interaction_data: InteractionDBWrite) -> str:
#         return self.sync_conv_rep.store_new_interaction(conversation_orm, interaction_data )


class ConversationRepositorySync(ConversationRepositoryBase):
    def __init__(self, session):
        self.session = session

    def fetch_conversations(self) -> list[Conversation]:
        pass

    def fetch_selected_conversation_session_id(self) -> str:
        pass

    def create_new_conversation_store_interaction(self, title: str) -> Conversation:
        pass

    def fetch_conversation_with_interactions(
        self, conversation_session_id: str
    ) -> Optional[Conversation]:
        pass

    def store_new_interaction(
        self, conversation_orm: Conversation, interaction_data: InteractionDBWrite
    ) -> str:
        pass


def ConversationRepositoryFactory(
    session: Union[Session, AsyncSession], is_async: bool
) -> ConversationRepositoryBase:
    if is_async:
        return ConversationRepositoryAsync(session)
    elif not is_async:
        return ConversationRepositorySync(session)
    else:
        raise ValueError(f"is_async variable is misisng or undefined: {is_async}")
