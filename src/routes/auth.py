from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify
from functools import wraps
from ..models.user import get_user_by_email, create_user, get_user_by_id

auth_bp = Blueprint('auth', __name__)

def login_required(f):
    """Decorator to require user login for a route."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('auth.login_page'))
        user = get_user_by_id(session['user_id'])
        if not user:
            session.clear()
            return redirect(url_for('auth.login_page'))
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/register', methods=['GET'])
def register_page():
    if 'user_id' in session:
        return redirect(url_for('projects.projects'))
    return render_template('auth/register.html')

@auth_bp.route('/register', methods=['POST'])
def register():
    email = request.form.get('email')
    password = request.form.get('password')
    password_confirm = request.form.get('password_confirm')
    
    # Validation
    if not email or not password:
        return render_template('auth/register.html', error='Email and password are required'), 400
    
    if password != password_confirm:
        return render_template('auth/register.html', error='Passwords do not match'), 400
    
    if len(password) < 6:
        return render_template('auth/register.html', error='Password must be at least 6 characters'), 400
    
    # Check if user exists
    if get_user_by_email(email):
        return render_template('auth/register.html', error='Email already registered'), 400
    
    # Create user
    try:
        user = create_user(email, password)
        session['user_id'] = user.id
        return redirect(url_for('projects.projects'))
    except Exception as e:
        return render_template('auth/register.html', error='Registration failed'), 400

@auth_bp.route('/login', methods=['GET'])
def login_page():
    if 'user_id' in session:
        return redirect(url_for('projects.projects'))
    return render_template('auth/login.html')

@auth_bp.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')
    
    if not email or not password:
        return render_template('auth/login.html', error='Email and password are required'), 400
    
    user = get_user_by_email(email)
    if not user or not user.check_password(password):
        return render_template('auth/login.html', error='Invalid email or password'), 401
    
    session['user_id'] = user.id
    return redirect(url_for('projects.projects'))

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return redirect(url_for('auth.login_page'))

@auth_bp.route('/api/auth/me', methods=['GET'])
def api_get_current_user():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'authenticated': False}), 401
    
    user = get_user_by_id(user_id)
    if not user:
        session.clear()
        return jsonify({'authenticated': False}), 401
    
    return jsonify({
        'authenticated': True,
        'user': {
            'id': user.id,
            'email': user.email
        }
    })
