from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from database.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class Conversation(Base):
    __tablename__ = "conversation"

    id = Column(Integer, primary_key=True)
    title = Column(String(256), unique=True, nullable=False)
    conversation_session_id = Column(
        String(36), unique=True, nullable=False, default=generate_uuid
    )
    interactions = relationship(
        "Interaction",
        back_populates="conversation",
        cascade="all, delete",
        passive_deletes=True,
    )

    __table_args__ = (
        Index("conversation_session_id_index", "conversation_session_id"),
    )


class Interaction(Base):
    __tablename__ = "interaction"

    id = Column(Integer, primary_key=True)
    interaction_session_id = Column(
        String(36), nullable=False, default=generate_uuid
    )  # Unique for each interaction
    conversation_session_id = Column(
        String(36),
        ForeignKey("conversation.conversation_session_id", ondelete="CASCADE"),
        nullable=False,
    )  # Same for all interactions in a conversation
    timestamp = Column(DateTime, default=datetime.utcnow)
    # timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    prompt = Column(String(8192), nullable=False)
    response = Column(String(8192), nullable=False)
    token_count = Column(Integer, nullable=False)
    prompt_token_count = Column(
        Integer, nullable=False
    )  # New field for token count of the prompt
    response_token_count = Column(
        Integer, nullable=False
    )  # New field for token count of the response
    model_name = Column(
        String(256), nullable=False
    )  # New field to store the model name
    conversation = relationship("Conversation", back_populates="interactions")
    # Additional fields can be added in the future, e.g., sentiment

    __table_args__ = (
        Index("interaction_session_id_index", "interaction_session_id"),
        Index("interaction_conversation_session_id_index", "conversation_session_id"),
    )

    def attributes_except_ids(self):
        return {
            "prompt": self.prompt,
            "response": self.response,
            "token_count": self.token_count,
            "prompt_token_count": self.prompt_token_count,
            "response_token_count": self.response_token_count,
            "model_name": self.model_name,
        }
