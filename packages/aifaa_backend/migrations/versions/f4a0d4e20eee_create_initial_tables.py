from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from datetime import datetime
from uuid import uuid4

revision: str = 'f4a0d4e20eee'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Upgrade schema."""

    # --- languages ---
    op.create_table(
        'languages',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('name', sa.String(), unique=True, nullable=False),
        sa.Column('code', sa.String(), unique=True, nullable=False),
        sa.Column('region', sa.String(), nullable=True),
    )

    # --- users ---
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('preferred_language_id', sa.Integer(), sa.ForeignKey('languages.id')),
        sa.Column('created_at', sa.DateTime(), default=datetime.utcnow),
    )

    # --- first_aid_guides ---
    op.create_table(
        'first_aid_guides',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('steps', postgresql.JSONB(), nullable=False),
        sa.Column('language_id', sa.Integer(), sa.ForeignKey('languages.id')),
        sa.Column('created_at', sa.DateTime(), default=datetime.utcnow),
    )

    # --- emergency_call_logs ---
    op.create_table(
        'emergency_call_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('timestamp', sa.DateTime(), default=datetime.utcnow),
        sa.Column('location', sa.String(), nullable=True),
        sa.Column('action_taken', sa.String(), nullable=True),
    )

    # --- chat_sessions ---
    op.create_table(
        'chat_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('started_at', sa.DateTime(), default=datetime.utcnow),
        sa.Column('ended_at', sa.DateTime(), nullable=True),
    )

    # --- messages ---
    op.create_table(
        'messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('chat_sessions.id')),
        sa.Column('sender', sa.Enum('user', 'ai', name='sender_type'), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), default=datetime.utcnow),
    )

    # --- location_logs ---
    op.create_table(
        'location_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('latitude', sa.Float()),
        sa.Column('longitude', sa.Float()),
        sa.Column('timestamp', sa.DateTime(), default=datetime.utcnow),
    )

    # --- feedback ---
    op.create_table(
        'feedback',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid4),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('message', sa.Text()),
        sa.Column('rating', sa.Integer()),
        sa.Column('submitted_at', sa.DateTime(), default=datetime.utcnow),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('feedback')
    op.drop_table('location_logs')
    op.drop_table('messages')
    op.drop_table('chat_sessions')
    op.drop_table('emergency_call_logs')
    op.drop_table('first_aid_guides')
    op.drop_table('users')
    op.drop_table('languages')
    op.execute('DROP TYPE IF EXISTS sender_type')
