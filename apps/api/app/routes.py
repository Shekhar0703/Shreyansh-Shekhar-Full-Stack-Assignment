from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from uuid import UUID

from app.services.mock_ai import build_insights

router = APIRouter()
SUPPORTED_LANGUAGES = {"en", "es", "fr", "de"}


class PromptRequest(BaseModel):
    prompt: str = Field(min_length=1)
    targetLanguage: str = Field(min_length=2, max_length=5)
    contextId: UUID | None = None
    page: int = Field(default=1, ge=1)
    pageSize: int = Field(default=10, ge=1, le=50)


class InsightItem(BaseModel):
    id: str
    title: str
    content: str
    category: str


class PaginationMeta(BaseModel):
    page: int
    pageSize: int
    total: int
    hasMore: bool


class PromptResponse(BaseModel):
    status: str
    message: str | None = None
    insights: list[InsightItem] = Field(default_factory=list)
    pagination: PaginationMeta | None = None


@router.post("/prompt", response_model=PromptResponse)
def submit_prompt(payload: PromptRequest) -> PromptResponse:
    prompt = payload.prompt.strip()
    language = payload.targetLanguage.strip().lower()
    page = payload.page
    page_size = payload.pageSize

    if not prompt:
        raise HTTPException(status_code=400, detail={"error": "INVALID_PROMPT", "message": "Prompt is required"})

    if language not in SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=400,
            detail={"error": "INVALID_LANGUAGE", "message": "Target language is not supported"},
        )

    if len(prompt) < 5 or prompt.lower() in {"help", "more", "details"}:
        return PromptResponse(status="NEEDS_CLARIFICATION", message="Please provide more details")

    insights = build_insights(prompt=prompt, target_language=language)
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    page_items = insights[start_index:end_index]
    return PromptResponse(
        status="SUCCESS",
        insights=page_items,
        pagination=PaginationMeta(
            page=page,
            pageSize=page_size,
            total=len(insights),
            hasMore=end_index < len(insights),
        ),
    )
