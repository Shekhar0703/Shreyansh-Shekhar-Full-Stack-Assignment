from __future__ import annotations


def build_insights(prompt: str, target_language: str) -> list[dict[str, str]]:
    topic_words = [word.strip(".,:;!?()[]") for word in prompt.split() if len(word.strip(".,:;!?()[]")) > 3]
    seed = topic_words[:5] or [prompt[:12] or "insight"]

    insights: list[dict[str, str]] = []
    for index in range(1, 21):
        token = seed[(index - 1) % len(seed)]
        insights.append(
            {
                "id": f"{target_language}-{index}",
                "title": f"{token.title()} insight {index}",
                "content": f"{token.title()} insight {index} for {target_language.upper()} based on: {prompt}",
                "category": "analysis" if index % 2 else "summary",
            }
        )
    return insights
