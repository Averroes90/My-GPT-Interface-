from utils import truncation_utils as tu
from schemas import schemas
from adapters import aimodeladapter as modeladapter
from repositories.unit_of_work import UnitOfWorkBase


class InteractionProcesser:
    def __init__(
        self, prompt_data: schemas.InteractionCreate, unit: UnitOfWorkBase
    ) -> None:
        self.prompt_data: schemas.InteractionCreate = prompt_data
        self.unit = unit
        self.model_handler = modeladapter.get_ai_model_handler(
            self.prompt_data.model_name
        )

    async def process_interaction(self) -> None:
        conversation_extended = schemas.ConversationExtended.model_validate(
            {
                "conversation_session_id": self.prompt_data.conversation_session_id,
                "title": self.prompt_data.new_conversation_title,
            }
        )
        if not self.prompt_data.new_conversation_checkbox:
            conversation_m = ConversationManager(
                self.unit,
                self.prompt_data.model_name,
                self.prompt_data.conversation_session_id,
            )
            conversation_extended = await (
                conversation_m.fetch_conversation_with_interactions()
            )
        messages = await tu.truncate_and_format_interactions(
            conversation_extended, self.prompt_data, self.model_handler
        )
        self.prompt_data.response = await self.model_handler.generate_text(
            messages, self.prompt_data.token_reserve
        )
        self.prompt_data.response_token_count = self.model_handler.count_tokens(
            self.prompt_data.response
        )
        interaction_data = schemas.InteractionDBWrite.model_validate(
            self.prompt_data.model_dump()
        )
        if self.prompt_data.new_conversation_checkbox:
            conversation_create = schemas.ConversationCreate.model_validate(
                conversation_extended.model_dump(exclude={"conversation_session_id"})
            )
            conversation_orm = (
                await self.unit.conv_db_rep.create_new_conversation_store_interaction(
                    conversation_create, interaction_data
                )
            )
            self.prompt_data.conversation_session_id = (
                conversation_orm.conversation_session_id
            )
        else:
            conversation_orm = await self.unit.conv_db_rep.store_new_interaction(
                conversation_extended, interaction_data
            )
        self.prompt_data.interaction_session_id = (
            conversation_orm.interactions[-1].interaction_session_id
            if conversation_orm.interactions
            else None
        )
        return


class ConversationManager:
    def __init__(
        self,
        unit: UnitOfWorkBase,
        model_name: str = None,
        conversation_session_id: str = None,
    ) -> None:
        self.conversation_session_id: str = conversation_session_id
        self.unit: UnitOfWorkBase = unit
        if model_name:
            self.model_name = model_name
            self.model_handler = modeladapter.get_ai_model_handler(model_name)

    async def fetch_conversation_list(self) -> schemas.ConversationList:
        conversations = await self.unit.conv_db_rep.fetch_conversations()
        conversations_base_list = [
            schemas.ConversationBase.model_validate(conversation)
            for conversation in conversations
        ]
        selected_conversation_id = (
            await self.unit.conv_db_rep.fetch_selected_conversation_session_id()
        )
        conversation_list = schemas.ConversationList.model_validate(
            {
                "conversation_list": conversations_base_list,
                "selected_conversation_id": selected_conversation_id,
            }
        )
        return conversation_list

    async def fetch_conversation_with_interactions(
        self,
    ) -> schemas.ConversationExtended:
        conversation_orm = (
            await self.unit.conv_db_rep.fetch_conversation_with_interactions(
                self.conversation_session_id
            )
        )
        new_conversation_extended = schemas.ConversationExtended.model_validate(
            conversation_orm
        )
        new_conversation_extended.orm_model = conversation_orm
        for interaction in new_conversation_extended.interactions:
            self.model_handler.format_prompt(interaction.prompt)
            self.model_handler.format_response(interaction.response)
            interaction.prompt_token_count = self.model_handler.prompt_token_count
            interaction.response_token_count = self.model_handler.response_token_count
            new_conversation_extended.total_tokens += (
                self.model_handler.prompt_token_count
                + self.model_handler.response_token_count
            )
        return new_conversation_extended
