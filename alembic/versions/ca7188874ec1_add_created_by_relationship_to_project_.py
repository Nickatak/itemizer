"""Add created_by relationship to Project, Material, Contact, Tag, and Task models

Revision ID: ca7188874ec1
Revises: e9b36db6b219
Create Date: 2026-01-09 12:38:04.389499

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ca7188874ec1'
down_revision: Union[str, Sequence[str], None] = 'e9b36db6b219'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # SQLite requires batch mode for foreign key operations
    with op.batch_alter_table('contact', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_by_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key('fk_contact_created_by_id', 'user', ['created_by_id'], ['id'])
    
    with op.batch_alter_table('material', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_by_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key('fk_material_created_by_id', 'user', ['created_by_id'], ['id'])
    
    with op.batch_alter_table('project', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_by_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key('fk_project_created_by_id', 'user', ['created_by_id'], ['id'])
    
    with op.batch_alter_table('tag', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_by_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key('fk_tag_created_by_id', 'user', ['created_by_id'], ['id'])
    
    with op.batch_alter_table('task', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_by_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key('fk_task_created_by_id', 'user', ['created_by_id'], ['id'])


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('task', schema=None) as batch_op:
        batch_op.drop_constraint('fk_task_created_by_id', type_='foreignkey')
        batch_op.drop_column('created_by_id')
    
    with op.batch_alter_table('tag', schema=None) as batch_op:
        batch_op.drop_constraint('fk_tag_created_by_id', type_='foreignkey')
        batch_op.drop_column('created_by_id')
    
    with op.batch_alter_table('project', schema=None) as batch_op:
        batch_op.drop_constraint('fk_project_created_by_id', type_='foreignkey')
        batch_op.drop_column('created_by_id')
    
    with op.batch_alter_table('material', schema=None) as batch_op:
        batch_op.drop_constraint('fk_material_created_by_id', type_='foreignkey')
        batch_op.drop_column('created_by_id')
    
    with op.batch_alter_table('contact', schema=None) as batch_op:
        batch_op.drop_constraint('fk_contact_created_by_id', type_='foreignkey')
        batch_op.drop_column('created_by_id')
