FLASK_APP = src.app:create_app
FLASK := .venv/bin/flask

.PHONY: run
run:
	$(FLASK) --app=$(FLASK_APP) run --debug
