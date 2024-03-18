from fastapi import FastAPI, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import SessionLocal
from config import settings
from schemas.schemas import (
    InteractionCreate,
    ConversationExtended,
    InteractionReturn,
    ConversationList,
)
from repositories.unit_of_work import UOW_Factory
import services.services as services
from errors import register_exception_handlers
import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

app = FastAPI()
is_async = True
register_exception_handlers(app)

uow = UOW_Factory(SessionLocal, is_async)


# Example of accessing a settings value
@app.get("/info")
async def info():
    return {"Debug Mode": settings.debug}


@app.get("/api/get_conversation_titles", response_model=ConversationList)
async def fetch_conversation_titles(request: Request) -> ConversationList:
    logging.info(f"====== BREAKPOINT: {request.url.path} ======")
    async with uow as unit:
        conversation_m = services.ConversationManager(
            unit,
        )
        conversation_list = await conversation_m.fetch_conversation_list()
    return conversation_list


@app.post("/api/prompt", response_model=InteractionReturn)
async def handle_prompt(
    request: Request, prompt_data: InteractionCreate
) -> InteractionReturn:
    logging.info(f"====== BREAKPOINT: {request.url.path} ======")
    async with uow as unit:
        await services.InteractionProcesser(prompt_data, unit).process_interaction()
    return prompt_data


@app.get(
    "/api/get_interactions/{conversation_session_id}",
    response_model=ConversationExtended,
)
async def fetch_interactions(
    request: Request,
    conversation_session_id: str,
    model_name: str = Query(...),
) -> ConversationExtended:
    logging.info(f"====== BREAKPOINT: {request.url.path} ======")
    async with uow as unit:
        conversation = await services.ConversationManager(
            unit, model_name, conversation_session_id
        ).fetch_conversation_with_interactions()
    return conversation
