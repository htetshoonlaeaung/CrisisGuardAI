"""create_initial_tables

Revision ID: 0001
Revises: 
Create Date: 2026-08-20 09:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '0001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. emergency_sessions
    op.create_table(
        'emergency_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('session_token', sa.String(length=64), nullable=False, unique=True),
        sa.Column('domain', sa.String(length=50), nullable=False),
        sa.Column('current_severity', sa.String(length=20), server_default='moderate', nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False)
    )
    op.create_index('idx_sessions_token', 'emergency_sessions', ['session_token'])

    # 2. session_facts
    op.create_table(
        'session_facts',
        sa.Column('id', sa.BigInteger().with_variant(sa.Integer(), 'sqlite'), primary_key=True, autoincrement=True),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('emergency_sessions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('fact_key', sa.String(length=100), nullable=False),
        sa.Column('fact_value', sa.String(length=100), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False)
    )
    op.create_index('idx_facts_session', 'session_facts', ['session_id'])

    # 3. triage_audit_trails
    op.create_table(
        'triage_audit_trails',
        sa.Column('id', sa.BigInteger().with_variant(sa.Integer(), 'sqlite'), primary_key=True, autoincrement=True),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('emergency_sessions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('recommended_action', sa.String(length=255), nullable=False),
        sa.Column('severity', sa.String(length=20), nullable=False),
        sa.Column('reasons', sa.JSON().with_variant(postgresql.JSONB(), 'postgresql'), nullable=False),
        sa.Column('prohibited_actions', sa.JSON().with_variant(postgresql.JSONB(), 'postgresql'), nullable=False),
        sa.Column('evaluation_latency_ms', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False)
    )
    op.create_index('idx_audits_session', 'triage_audit_trails', ['session_id'])

    # 4. emergency_shelters
    op.create_table(
        'emergency_shelters',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('disaster_type', sa.String(length=50), nullable=False),
        sa.Column('address', sa.String(length=255), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('capacity', sa.Integer(), nullable=False),
        sa.Column('current_occupancy', sa.Integer(), server_default='0', nullable=False),
        sa.Column('contact_phone', sa.String(length=50), nullable=False),
        sa.Column('is_open', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('facilities', sa.JSON().with_variant(postgresql.JSONB(), 'postgresql'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False)
    )


def downgrade() -> None:
    op.drop_table('emergency_shelters')
    op.drop_index('idx_audits_session', table_name='triage_audit_trails')
    op.drop_table('triage_audit_trails')
    op.drop_index('idx_facts_session', table_name='session_facts')
    op.drop_table('session_facts')
    op.drop_index('idx_sessions_token', table_name='emergency_sessions')
    op.drop_table('emergency_sessions')
