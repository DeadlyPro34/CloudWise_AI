"""
CloudAccount model - connected cloud provider accounts.

Per architecture discussion: named "cloud_accounts" (not "aws_accounts")
with a `provider` field so the schema is multi-cloud-ready from day one,
even though the MVP implementation only supports AWS.
"""

import uuid
import enum
from datetime import datetime, timezone

from sqlalchemy import String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base
from app.db.types import GUID


class CloudProvider(str, enum.Enum):
    AWS = "AWS"
    GCP = "GCP"      # not implemented in MVP, reserved for future
    AZURE = "AZURE"  # not implemented in MVP, reserved for future


class CloudAccountStatus(str, enum.Enum):
    CONNECTED = "CONNECTED"
    DISCONNECTED = "DISCONNECTED"
    ERROR = "ERROR"
    SYNCING = "SYNCING"


class CloudAccount(Base):
    __tablename__ = "cloud_accounts"

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("organizations.id"), nullable=False
    )

    provider: Mapped[CloudProvider] = mapped_column(
        SQLEnum(CloudProvider, name="cloud_provider_enum"),
        nullable=False,
        default=CloudProvider.AWS,
    )

    account_id: Mapped[str] = mapped_column(String(50), nullable=False)  # AWS Account ID
    account_name: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Per Security Policy: only Role ARN is stored, never long-term credentials.
    role_arn: Mapped[str | None] = mapped_column(String, nullable=True)
    external_id: Mapped[str | None] = mapped_column(String, nullable=True)

    # Credentials are encrypted at rest using Fernet symmetric encryption.
    # In a full enterprise production environment, consider augmenting this with AWS STS AssumeRole cross-account patterns.
    aws_access_key_enc: Mapped[str | None] = mapped_column(String, nullable=True)
    aws_secret_key_enc: Mapped[str | None] = mapped_column(String, nullable=True)
    region: Mapped[str | None] = mapped_column(String(50), nullable=True, default="us-east-1")
    is_localstack: Mapped[bool] = mapped_column(default=False, server_default="false")

    status: Mapped[CloudAccountStatus] = mapped_column(
        SQLEnum(CloudAccountStatus, name="cloud_account_status_enum"),
        nullable=False,
        default=CloudAccountStatus.DISCONNECTED,
    )

    last_sync_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
