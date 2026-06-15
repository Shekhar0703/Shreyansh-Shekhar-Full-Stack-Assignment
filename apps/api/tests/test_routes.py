import unittest

from fastapi.testclient import TestClient

from app.main import app
from app.routes import PromptRequest, submit_prompt


class PromptRouteTests(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_successful_prompt_returns_paginated_insights(self) -> None:
        response = submit_prompt(
            PromptRequest(prompt="Analyze this workflow for the frontend client", targetLanguage="en")
        )

        self.assertEqual(response.status, "SUCCESS")
        self.assertEqual(len(response.insights), 10)
        self.assertIsNotNone(response.pagination)
        self.assertTrue(response.pagination.hasMore)

    def test_short_prompt_requests_clarification(self) -> None:
        response = submit_prompt(PromptRequest(prompt="help", targetLanguage="en"))

        self.assertEqual(response.status, "NEEDS_CLARIFICATION")
        self.assertEqual(response.message, "Please provide more details")

    def test_invalid_language_returns_structured_error(self) -> None:
        response = self.client.post(
            "/api/prompt",
            json={"prompt": "Analyze this workflow for the frontend client", "targetLanguage": "jp"},
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {"error": "INVALID_LANGUAGE", "message": "Target language is not supported"})

    def test_blank_prompt_returns_structured_error(self) -> None:
        response = self.client.post(
            "/api/prompt",
            json={"prompt": "   ", "targetLanguage": "en"},
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {"error": "INVALID_PROMPT", "message": "Prompt is required"})


if __name__ == "__main__":
    unittest.main()
