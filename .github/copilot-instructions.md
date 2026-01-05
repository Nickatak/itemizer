# Copilot Instructions for this Repo

These notes help AI agents work productively in this Flask + SQLAlchemy project. Focus on the conventions and workflows actually used here.

## Big Picture
- App type: single Flask app with an application factory (`create_app`) and server-side rendered Jinja templates.
- Data layer: SQLAlchemy models in a single metadata, with a many-to-many `Project` ↔ `Material` join table and a `Task` table related to `Project`.
- Logic split: HTTP routes live in [src/app.py](src/app.py); database CRUD and relationship helpers live in [src/db_interface.py](src/db_interface.py). Keep business logic in `db_interface`, keep routes thin.
- Views: Jinja templates under [src/templates/](src/templates) with per-view CSS/JS in [src/static/](src/static).

## Key Files
- [src/app.py](src/app.py): `create_app()`, routes for projects, tasks, materials. Converts incoming form data to appropriate types, then calls `db_interface`.
- [src/models.py](src/models.py): `Material` (table `item`), `Project`, `Task`, and association table `project_materials`.
- [src/db_interface.py](src/db_interface.py): CRUD for `Material`, `Project`, `Task`; helpers to add/remove materials to/from projects.
- [alembic/](alembic): Alembic configuration and migration scripts. Metadata comes from `src.models.db`.
- [alembic.ini](alembic.ini): points to `sqlite:///./instance/items.db` for migrations.
- [Makefile](Makefile): `make run` to start the dev server via Flask CLI.
- [README.md](README.md): alternate run command: `python -m src.app`.

## Run, Debug, Env
- Quick start:
  - Create venv, install deps from [requirements.txt](requirements.txt).
  - Run dev server: `make run` (uses `.venv/bin/flask --app src.app:create_app run --debug`).
  - Alternatively: `python -m src.app` (invokes `create_app()` and `app.run(debug=True)`).
- Database init: `create_app()` calls `db.create_all()` to create tables for the configured SQLite DB if missing.

## Database & Migrations
- Alembic is configured to autogenerate with `compare_type` and `compare_server_default` in [alembic/env.py](alembic/env.py).
- Important: Runtime DB URL in [src/app.py](src/app.py) is `sqlite:///items.db`, while Alembic uses `sqlite:///./instance/items.db` in [alembic.ini](alembic.ini). Keep these consistent before generating/applying migrations (either align the app config or update `alembic.ini`).
- Typical workflow:
  - Generate: `alembic revision --autogenerate -m "desc"`
  - Upgrade: `alembic upgrade head`
  - Downgrade: `alembic downgrade -1`
- Current migration [alembic/versions/ebeab912352f_initial_migration.py](alembic/versions/ebeab912352f_initial_migration.py) contains no ops; schema is effectively managed by `db.create_all()` right now.

## Conventions & Patterns
- Routes stay thin and delegate to `db_interface` for all DB work. When adding features, put create/update/delete/query logic in `db_interface` and import it into routes.
- Date handling:
  - Forms post dates as `YYYY-MM-DD` strings.
  - Some routes parse to `datetime` (see task creation in [src/app.py](src/app.py)); `db_interface` can also parse strings for projects. Be consistent: prefer converting in the route layer before calling `db_interface`.
- Many-to-many materials:
  - Use `add_material_to_project()` / `remove_material_from_project()` in [src/db_interface.py](src/db_interface.py). Do not manipulate `project.materials` directly in routes.
- Table names:
  - `Material` uses `__tablename__ = 'item'`. Foreign keys and joins reference `'item'` and `'project'` explicitly. Follow existing names when writing queries and migrations.
- Templates & static assets:
  - Each view has paired CSS/JS, e.g., [src/templates/project_detail.html](src/templates/project_detail.html) with [src/static/css/project_detail.css](src/static/css/project_detail.css) and [src/static/js/project_detail.js](src/static/js/project_detail.js). Mirror this when adding pages.

## Adding a Feature (Example)
- Goal: add “edit task”
  1) Add `update_task(...)` usage in a new route in [src/app.py](src/app.py) (GET renders form, POST submits changes).
  2) Implement/extend logic in [src/db_interface.py](src/db_interface.py) if new fields/behaviors are needed.
  3) Create template under [src/templates/](src/templates) and optional CSS/JS under [src/static/](src/static).
  4) If models change, align DB URLs, then generate and apply an Alembic migration.

## Gotchas
- DB URL mismatch (runtime vs Alembic) can make migrations target a different SQLite file than the app uses. Align before migration operations.
- Autogenerate is enabled; review generated migrations, especially around defaults and type changes in SQLite (which has limitations).
- `db.create_all()` runs at startup; once you adopt migrations, prefer managing schema via Alembic, not implicit `create_all()` changes.

## Preferred Commands
- Run app: `make run`
- Run app (alt): `python -m src.app`
- Migrations: `alembic revision --autogenerate -m "msg" && alembic upgrade head`

If anything here seems off for your change, ask to clarify DB URL alignment, where to put new logic, or how to structure new views.
