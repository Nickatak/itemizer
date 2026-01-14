from flask import Flask, redirect, url_for, session
from .models import db
from .routes.projects import projects_bp
from .routes.tasks import tasks_bp
from .routes.materials import materials_bp
from .routes.contacts import contacts_bp
from .routes.auth import auth_bp
from .routes.api import api_bp

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///items.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = 'your-secret-key-change-in-production'
    db.init_app(app)



    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(projects_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(materials_bp)
    app.register_blueprint(contacts_bp)

    @app.route('/')
    def home():
        if 'user_id' not in session:
            return redirect(url_for('auth.login_page'))
        return redirect(url_for('projects.projects'))

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
