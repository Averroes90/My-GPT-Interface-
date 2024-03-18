from repositories.conversation_repository import ConversationRepositoryFactory
from abc import ABC, abstractmethod
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from typing import Union
from functools import partial


class UnitOfWorkBase(ABC):
    @abstractmethod
    def __aenter__(self):
        """Prepare the resource, and return the context manager itself."""
        raise NotImplementedError

    @abstractmethod
    def __aexit__(self, exc_type, exc_val, exc_tb):
        """Clean up resources and handle exceptions."""
        raise NotImplementedError


class AsyncUnitOfWork(UnitOfWorkBase):
    def __init__(
        self,
        session_factory,
        repository_factory=ConversationRepositoryFactory,
    ):
        self.session_factory = session_factory
        self.repository_factory = repository_factory

    async def __aenter__(self):
        self.session = self.session_factory()
        self.transaction = await self.session.begin()
        self.conv_db_rep = self.repository_factory(self.session, is_async=True)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type is None:
                await self.transaction.commit()
            else:
                await self.transaction.rollback()
        except Exception as commit_exc:
            # Optionally handle the commit exception, e.g., logging
            await self.transaction.rollback()  # Ensure rollback if commit fails
            raise commit_exc  # Optionally re-raise the exception
        finally:
            await self.session.close()


class SyncUnitOfWork(UnitOfWorkBase):
    def __init__(
        self, session_factory, repository_factory=ConversationRepositoryFactory
    ):
        self.session_factory = session_factory
        self.repository_factory = repository_factory

    def __enter__(self):
        self.session = self.session_factory()
        self.transaction = self.session.begin()  # Start a synchronous transaction
        self.conversations = self.repository_factory(self.session, is_async=False)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type is None:
                self.transaction.commit()  # Commit changes if no exceptions
            else:
                self.transaction.rollback()  # Roll back if an exception occurred
        except Exception as commit_exc:
            self.transaction.rollback()
            raise commit_exc
        finally:
            self.session.close()


def UOW_Factory(
    session_factory: Union[Session, AsyncSession],
    is_async: bool = True,
    repository_factory: ConversationRepositoryFactory = ConversationRepositoryFactory,
) -> UnitOfWorkBase:
    if is_async:
        return AsyncUnitOfWork(session_factory, repository_factory)
    elif not is_async:
        return SyncUnitOfWork(session_factory, repository_factory)
    else:
        raise ValueError(f"Unsupported or missing mode: {is_async}")
