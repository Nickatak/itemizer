from flask import Flask, redirect, url_for
from .models import db
from .routes.projects import projects_bp
from .routes.tasks import tasks_bp
from .routes.materials import materials_bp
from .routes.contacts import contacts_bp

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///items.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    with app.app_context():
        db.create_all()

    # Register blueprints
    app.register_blueprint(projects_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(materials_bp)
    app.register_blueprint(contacts_bp)

    @app.route('/')
    def home():
        return redirect(url_for('projects.projects'))

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
