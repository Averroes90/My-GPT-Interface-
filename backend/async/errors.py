
from fastapi import Request,  HTTPException, FastAPI
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError, DBAPIError, IntegrityError
from pydantic import ValidationError
import traceback


async def generic_exception_handler(request: Request, exc: Exception):
    error_info = f"Unhandled server error: {repr(exc)}"
    print(error_info)
    # traceback.print_exc()  # This will print the full traceback to the terminal
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred on the server."},
        headers={"X-Error": "There was an unexpected error. Please contact support."},
    )

async def http_exception_handler(request: Request, exc: HTTPException):
    print(f"HTTP error: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    error_info = f"Database error: {str(exc)}"
    print(error_info)
    traceback.print_exc()  # Print the full traceback for SQLAlchemy errors
    return JSONResponse(
        status_code=400,
        content={"detail": "A database error occurred. Please try again later."},
        headers={"X-Error": "Database error encountered"},
    )
async def dbapi_exception_handler(request: Request, exc: DBAPIError):
    error_info = f"DBAPI error: {str(exc)}"
    print(error_info)
    traceback.print_exc()  # Print the full traceback for DBAPI errors
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal database error occurred."},
        headers={"X-Error": "Internal database error"},
    )

async def attribute_error_handler(request: Request, exc: AttributeError):
    error_info = f"Attribute error: {str(exc)}"
    print(error_info)
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": "An attribute error occurred on the server."},
        headers={"X-Error": "Attribute error encountered."},
    )
async def request_validation_exception_handler(request: Request, exc: RequestValidationError):
    print("Request validation error:", exc.errors())
    # traceback.print_exc()
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Error validating request.",
            "errors": exc.errors(),
            "body": exc.body,
        },
    )

async def pydantic_validation_exception_handler(request: Request, exc: ValidationError):
    print("Request validation error:", exc.errors())
    traceback.print_exc()
    return JSONResponse(
        status_code=400,
        content={
            "detail": "Error validating Pydantic model.",
        },
    )
async def type_error_handler(request: Request, exc: TypeError):
    traceback.print_exc()
    print("TypeError occurred:", str(exc))
    return JSONResponse(
        status_code=500,  # Or another appropriate status code
        content={
            "detail": "A type error occurred in the server.",
            "message": str(exc),
        },
    )

async def integrity_error_handler(request: Request, exc: IntegrityError):
    traceback.print_exc()
    print(f"Integrity error: {exc}")
    error_detail = "A unique constraint was violated. Please ensure the data is unique."

    return JSONResponse(
        status_code=409,  # 409 Conflict is often used for duplicate resource or constraint violations
        content={"detail": error_detail},
        headers={"X-Error": "Integrity constraint violation"},
    )


def register_exception_handlers(app: FastAPI):
    app.exception_handler(Exception)(generic_exception_handler)
    app.exception_handler(HTTPException)(http_exception_handler)
    app.exception_handler(SQLAlchemyError)(sqlalchemy_exception_handler)
    app.exception_handler(DBAPIError)(dbapi_exception_handler)
    app.exception_handler(AttributeError)(attribute_error_handler)
    app.exception_handler(RequestValidationError)(request_validation_exception_handler)
    app.exception_handler(ValidationError)(pydantic_validation_exception_handler)
    app.exception_handler(TypeError)(type_error_handler)
    app.exception_handler(IntegrityError)(integrity_error_handler)