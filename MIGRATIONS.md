# Database Migrations with Alembic

This project uses Alembic for database schema management and migrations.

## Setup (Already Complete)

- Alembic has been initialized in the `alembic/` directory
- The initial migration has been created and applied
- Database configuration is in `alembic.ini` (points to `sqlite:///./instance/items.db`)
- Migration scripts will be auto-generated based on model changes

## Common Commands

### View migration history
```bash
alembic history
```

### Create a new migration (after modifying models.py)
```bash
alembic revision --autogenerate -m "Description of changes"
```

### Apply all pending migrations
```bash
alembic upgrade head
```

### Apply a specific number of migrations
```bash
alembic upgrade +2  # Apply next 2 migrations
```

### Rollback to previous migration
```bash
alembic downgrade -1
```

### Rollback all migrations
```bash
alembic downgrade base
```

## Workflow for Making Schema Changes

1. **Modify your models** in `src/models.py`
2. **Generate a migration**:
   ```bash
   alembic revision --autogenerate -m "Descriptive message"
   ```
3. **Review the generated migration** in `alembic/versions/`
4. **Apply the migration**:
   ```bash
   alembic upgrade head
   ```

## Important Notes

- Always review auto-generated migrations before applying them
- For SQLite, some operations like `ALTER COLUMN` are not supported
- Keep migration files in version control
- Never modify applied migrations; create new ones instead
- The `instance/` directory contains the SQLite database file

## Configuration

- Migration scripts location: `alembic/versions/`
- Config file: `alembic.ini`
- Environment setup: `alembic/env.py`
