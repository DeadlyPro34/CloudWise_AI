"""
Copilot service — AI assistant with real infrastructure context.

build_context() queries the user's account data to construct a rich
system prompt.  chat() sends the user's message with context to Claude
and persists both user + assistant messages to the DB.
"""

import uuid
from datetime import date, timedelta

import anthropic
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.cloud_account import CloudAccount
from app.models.resource_inventory import ResourceInventory, ResourceType
from app.models.resource_cost import ResourceCost
from app.models.recommendation import Recommendation, RecommendationStatus
from app.models.cloud_health_score import CloudHealthScore
from app.models.copilot import CopilotConversation, CopilotMessage, MessageRole


def build_context(db: Session, cloud_account_id: uuid.UUID) -> str:
    """
    Build a concise natural-language context string summarising the user's
    AWS environment for the Claude system prompt.
    """
    # Resource counts by type
    type_counts = dict(
        db.execute(
            select(ResourceInventory.resource_type, func.count(ResourceInventory.id))
            .where(ResourceInventory.cloud_account_id == cloud_account_id)
            .group_by(ResourceInventory.resource_type)
        ).all()
    )
    total_resources = sum(type_counts.values())

    # Total spend (last 30 days)
    res_ids_sq = select(ResourceInventory.id).where(
        ResourceInventory.cloud_account_id == cloud_account_id
    )
    thirty_days_ago = date.today() - timedelta(days=30)

    total_spend = float(
        db.execute(
            select(func.sum(ResourceCost.daily_cost)).where(
                ResourceCost.resource_id.in_(res_ids_sq),
                ResourceCost.date >= thirty_days_ago,
            )
        ).scalar() or 0
    )

    # Top 5 open recommendations by savings
    top_recs = db.execute(
        select(Recommendation.title, Recommendation.estimated_monthly_savings)
        .where(
            Recommendation.resource_id.in_(res_ids_sq),
            Recommendation.status == RecommendationStatus.OPEN,
        )
        .order_by(Recommendation.estimated_monthly_savings.desc())
        .limit(5)
    ).all()

    # Latest health score
    latest_hs = db.execute(
        select(CloudHealthScore)
        .where(CloudHealthScore.cloud_account_id == cloud_account_id)
        .order_by(CloudHealthScore.calculated_at.desc())
    ).scalar_one_or_none()

    # Build summary
    lines = [
        "=== AWS Environment Summary ===",
        f"Total resources: {total_resources}",
    ]
    for rtype, count in type_counts.items():
        lines.append(f"  - {rtype.value if hasattr(rtype, 'value') else rtype}: {count}")

    lines.append(f"Total spend (last 30 days): ${total_spend:,.2f}")

    if latest_hs:
        lines.append(
            f"Cloud Health Score: {float(latest_hs.score)}/100 "
            f"(Resource Efficiency: {float(latest_hs.resource_efficiency)}, "
            f"Cost Efficiency: {float(latest_hs.cost_efficiency)}, "
            f"Storage Efficiency: {float(latest_hs.storage_efficiency)}, "
            f"Forecast Risk: {float(latest_hs.forecast_risk)})"
        )
    else:
        lines.append("Cloud Health Score: not yet calculated")

    if top_recs:
        lines.append("Top recommendations:")
        for title, savings in top_recs:
            lines.append(f"  - {title} (saves ${float(savings):,.2f}/mo)")
    else:
        lines.append("No open recommendations at this time.")

    return "\n".join(lines)


def chat(
    db: Session,
    org_id: uuid.UUID,
    user_message: str,
    cloud_account_id: uuid.UUID | None = None,
) -> tuple[str, uuid.UUID]:
    """
    Send a message to the AI copilot and persist the conversation.

    Returns (assistant_response_text, conversation_id).
    """
    # Find or create conversation (use latest open one for this org)
    conversation = db.execute(
        select(CopilotConversation)
        .where(CopilotConversation.organization_id == org_id)
        .order_by(CopilotConversation.created_at.desc())
    ).scalar_one_or_none()

    if not conversation:
        conversation = CopilotConversation(organization_id=org_id)
        db.add(conversation)
        db.flush()

    # Persist user message
    db.add(CopilotMessage(
        conversation_id=conversation.id,
        role=MessageRole.USER,
        content=user_message,
    ))
    db.flush()

    # Build context if we have a cloud account
    context = ""
    if cloud_account_id:
        try:
            context = build_context(db, cloud_account_id)
        except Exception:
            context = ""
    elif org_id:
        # Try to find a cloud account for this org
        account = db.execute(
            select(CloudAccount).where(CloudAccount.organization_id == org_id)
        ).scalar_one_or_none()
        if account:
            try:
                context = build_context(db, account.id)
            except Exception:
                context = ""

    # Call Claude
    if not settings.ANTHROPIC_API_KEY:
        response_text = (
            "The AI Copilot is not configured yet. "
            "Please add your Anthropic API key in Settings."
        )
    else:
        try:
            client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

            system_prompt = (
                "You are CloudWise AI Copilot, an expert AWS FinOps assistant. "
                "You help users understand their cloud spending, find savings opportunities, "
                "and optimize their AWS infrastructure. Be concise, actionable, and friendly.\n\n"
            )
            if context:
                system_prompt += f"Current environment data:\n{context}"

            # Fetch recent conversation history for context (last 10 messages)
            recent_msgs = db.execute(
                select(CopilotMessage)
                .where(CopilotMessage.conversation_id == conversation.id)
                .order_by(CopilotMessage.created_at.desc())
                .limit(10)
            ).scalars().all()

            # Build messages in chronological order (reverse the desc order)
            messages = []
            for msg in reversed(list(recent_msgs)):
                role = "user" if msg.role == MessageRole.USER else "assistant"
                messages.append({"role": role, "content": msg.content})

            response = client.messages.create(
                model=settings.CLAUDE_MODEL,
                max_tokens=1024,
                system=system_prompt,
                messages=messages,
            )
            response_text = response.content[0].text

        except Exception:
            response_text = (
                "The AI Copilot encountered an error. "
                "Please check your Anthropic API key in Settings."
            )

    # Persist assistant response
    db.add(CopilotMessage(
        conversation_id=conversation.id,
        role=MessageRole.ASSISTANT,
        content=response_text,
    ))
    db.commit()

    return response_text, conversation.id
