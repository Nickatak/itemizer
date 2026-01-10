from flask import Flask, redirect, url_for, session
from .models import db
from .models.user import create_user, get_user_by_email
from .routes.projects import projects_bp
from .routes.tasks import tasks_bp
from .routes.materials import materials_bp
from .routes.contacts import contacts_bp
from .routes.auth import auth_bp

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///items.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = 'your-secret-key-change-in-production'
    db.init_app(app)

    with app.app_context():
        db.create_all()
        
        # Create default user if it doesn't exist
        if not get_user_by_email('asdf@asdf.com'):
            create_user('asdf@asdf.com', 'asdf')

    # Register blueprints
    app.register_blueprint(auth_bp)
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
