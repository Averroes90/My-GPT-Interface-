from pydantic import (
    BaseModel,
    Field,
    ValidationInfo,
    field_validator,
    ValidationError,
    ConfigDict,
    model_validator,
    computed_field,
)
from datetime import datetime
from typing import Optional
from models.models import Conversation


class InteractionBase(BaseModel):
    model_config = ConfigDict(validate_assignment=True, str_strip_whitespace=True)

    prompt: str
    model_name: str


# Extended Model for Outputs, inheriting from Base
class InteractionReturn(InteractionBase):
    model_config = ConfigDict(validate_assignment=True, str_strip_whitespace=True)
    response: str
    truncation_index: int
    interaction_session_id: str = Field(..., max_length=36)
    conversation_session_id: str = Field(..., max_length=36)
    prompt_token_count: int
    response_token_count: int
    context_token_count: int


class InteractionCreate(InteractionReturn):
    model_config = ConfigDict(validate_assignment=True, str_strip_whitespace=True)
    conversation_session_id: Optional[str] = Field(None, max_length=36)
    interaction_session_id: Optional[str] = Field(None, max_length=36)
    new_conversation_title: Optional[str] = Field(None, max_length=256)
    new_conversation_checkbox: bool
    token_limit: int
    token_reserve: int
    prompt_token_count: Optional[int] = None
    truncation_index: Optional[int] = -1
    context_token_count: Optional[int] = 0
    response: Optional[str] = None
    token_count: Optional[int] = None
    response_token_count: Optional[int] = None

    @model_validator(mode="after")
    def ensure_correct_title_logic(self) -> "InteractionCreate":
        chckbox = self.new_conversation_checkbox
        title = self.new_conversation_title
        id = self.conversation_session_id
        if chckbox and title is None:
            raise ValueError(
                "new_conversation_title is required when new_conversation_checkbox is True"
            )
        if not chckbox and id is None:
            raise ValueError(
                "conversation_session_id is required when new_conversation_checkbox is False"
            )
        return self


class InteractionDBWrite(InteractionBase):
    model_config = ConfigDict(validate_assignment=True, str_strip_whitespace=True)
    conversation_session_id: str = Field(..., max_length=36)
    response: str
    prompt_token_count: int
    response_token_count: int

    @computed_field(
        return_type=int,
        alias="token_count",
        description="sum of prompt and response tokens",
        repr=True,
    )
    @property
    def token_count(self) -> int:
        return self.prompt_token_count + self.response_token_count


class InteractionDBRead(InteractionDBWrite):
    model_config = ConfigDict(
        from_attributes=True, validate_assignment=True, str_strip_whitespace=True
    )

    id: int
    timestamp: datetime
    interaction_session_id: str = Field(..., max_length=36)


class InteractionsList(BaseModel):
    model_config = ConfigDict(validate_assignment=True, str_strip_whitespace=True)


# Conversation schema
class ConversationBase(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        validate_assignment=True,
        str_strip_whitespace=True,
        arbitrary_types_allowed=True,
    )
    title: Optional[str] = Field(..., max_length=256)
    id: Optional[int] = None
    conversation_session_id: Optional[str] = Field(None, max_length=36)
    orm_model: Optional[Conversation] = Field(None, exclude=True)


class ConversationCreate(ConversationBase):
    model_config = ConfigDict(
        from_attributes=True,
        validate_assignment=True,
        str_strip_whitespace=True,
    )
    interactions: Optional[list[InteractionDBWrite]] = Field(default_factory=list)


class ConversationExtended(ConversationCreate):
    model_config = ConfigDict(
        from_attributes=True, validate_assignment=True, str_strip_whitespace=True
    )
    total_tokens: Optional[int] = 0
    interactions: Optional[list[InteractionDBRead]] = Field(default_factory=list)


class ConversationList(BaseModel):
    model_config = ConfigDict(validate_assignment=True, str_strip_whitespace=True)
    conversation_list: list[ConversationBase]
    selected_conversation_id: Optional[str] = None

    @computed_field(
        return_type=bool,
        alias="has_conversations",
        description="Indicates if there are any conversations",
        repr=True,
    )
    @property
    def has_conversations(self) -> bool:
        return bool(self.conversation_list)

    @model_validator(mode="after")
    def ensure_selected_id(self):
        # self.has_conversations = bool(self.conversation_list)
        if self.has_conversations and not bool(self.selected_conversation_id):
            raise ValueError(
                "selected_conversation_id is required when has_conversations is True"
            )
        return self

    # @field_validator('has_conversations',mode='after')
    # @classmethod
    # def set_has_conversations(cls, v: bool, info: ValidationInfo)->bool:
    #     v = bool(info.data.get('conversation_list'))
    #     return v


class CombinedResponse(BaseModel):
    conversation_list: ConversationList
    selected_conversation: Optional[ConversationExtended] = None
