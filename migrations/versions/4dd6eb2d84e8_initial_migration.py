"""Initial migration

Revision ID: 4dd6eb2d84e8
Revises: 
Create Date: 2023-08-18 16:21:57.165100

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4dd6eb2d84e8'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('interaction',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('session_id', sa.String(length=36), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.Column('prompt', sa.String(length=8192), nullable=False),
    sa.Column('response', sa.String(length=8192), nullable=False),
    sa.Column('token_count', sa.Integer(), nullable=False),
    sa.Column('model_name', sa.String(length=256), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('interaction')
    # ### end Alembic commands ###