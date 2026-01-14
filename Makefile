FLASK_APP = src.app:create_app
FLASK := .venv/bin/flask

.PHONY: run
run:
	$(FLASK) --app=$(FLASK_APP) run --debug

.PHONY: reset
reset:
	rm -rf ./instance/
	mkdir ./instance/
	touch ./instance/items.db
	alembic upgrade head