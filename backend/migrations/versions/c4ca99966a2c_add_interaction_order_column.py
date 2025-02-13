"""Add interaction order column

Revision ID: c4ca99966a2c
Revises: bfb904c6e997
Create Date: 2024-01-29 15:31:19.543072

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column, select, update, func

# revision identifiers, used by Alembic.
revision = 'c4ca99966a2c'
down_revision = 'bfb904c6e997'
branch_labels = None
depends_on = None

new_column = sa.Column('interaction_order', sa.Integer, nullable=True)

def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    # Add the new column to the 'interaction' table
    op.add_column('interaction', new_column)
    # Use SQLAlchemy's Table object to prepare for the raw SQL update
    interaction = table('interaction',
        column('id', sa.Integer),
        column('timestamp', sa.DateTime),
        column('conversation_session_id', sa.String),
        column('interaction_order', sa.Integer)
    )
    # Select all distinct conversation_session_ids
    conn = op.get_bind()
    conversation_session_ids = conn.execute(
        select(interaction.c.conversation_session_id).distinct()
    ).fetchall()

    # For each conversation, update the interaction order based on the timestamp
    for session_id in conversation_session_ids:
        # Get all interactions for the conversation, ordered by timestamp
        interactions = conn.execute(
            select(interaction.c.id, interaction.c.timestamp).
            where(interaction.c.conversation_session_id == session_id[0]).
            order_by(interaction.c.timestamp)
        ).fetchall()

        # Update interaction_order for each interaction
        for order, inter in enumerate(interactions, start=1):
            conn.execute(
                update(interaction).
                where(interaction.c.id == inter.id).
                values(interaction_order=order)
            )
    # After populating the column, set it to non-nullable if desired
    #op.alter_column('interaction', 'interaction_order', nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('interaction', schema=None) as batch_op:
        batch_op.drop_column('interaction_order')

    # ### end Alembic commands ###
