"""insert_default_categories

Revision ID: 87b50c8a14c8
Revises: f6c33112c164
Create Date: 2026-01-13 11:00:23.775033

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from werkzeug.security import generate_password_hash


# revision identifiers, used by Alembic.
revision: str = '87b50c8a14c8'
down_revision: Union[str, Sequence[str], None] = 'f6c33112c164'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create a default test user for development
    test_password_hash = generate_password_hash('asdf')
    op.execute(f"""
        INSERT INTO user (email, password_hash, created_at, updated_at)
        VALUES ('asdf@asdf.com', '{test_password_hash}', datetime('now'), datetime('now'))
    """)
    

    op.execute(f"""
        INSERT INTO user (email, password_hash, created_at, updated_at)
        VALUES ('system@itemizer.local', 'unlogginable', datetime('now'), datetime('now'))
    """)
    
    # Insert default categories (assigned to system user, which is user_id 2)
    categories = [
        ('Groceries', 'Food and grocery items', '#4CAF50'),
        ('Autos', 'Automotive parts and supplies', '#FF9800'),
        ('Tools', 'Tools and equipment', '#2196F3'),
        ('Tech', 'Technology and electronics', '#9C27B0'),
        ('Personal', 'Personal items and miscellaneous', '#F44336'),
    ]
    
    for name, description, color in categories:
        op.execute(f"""
            INSERT INTO category (name, description, color, created_by_id, created_at, updated_at)
            VALUES ('{name}', '{description}', '{color}', 2, datetime('now'), datetime('now'))
        """)


def downgrade() -> None:
    """Downgrade schema."""
    # Delete all categories
    op.execute("DELETE FROM category")
    # Delete both users
    op.execute("DELETE FROM user WHERE email IN ('asdf@asdf.com', 'system@itemizer.local')")

