from flask import request, jsonify
from ..auth import login_required
from ...models.user import (
    create_user, get_user_by_id, get_user_by_email, update_user, delete_user, get_all_users
)
from ...models import db
from . import api_bp


@api_bp.route('/users', methods=['POST'])
@login_required
def api_create_user():
    """Create a new user"""
    data = request.get_json()
    
    try:
        # Check if email already exists
        if get_user_by_email(data.get('email')):
            return jsonify({'success': False, 'error': 'Email already exists'}), 400
        
        user = create_user(
            email=data.get('email'),
            password=data.get('password')
        )
        db.session.commit()
        return jsonify({'success': True, 'id': user.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/users/<int:user_id>', methods=['GET'])
@login_required
def api_get_user(user_id):
    """Get a single user by ID"""
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404
    
    return jsonify({
        'success': True,
        'data': {
            'id': user.id,
            'email': user.email,
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'updated_at': user.updated_at.isoformat() if user.updated_at else None
        }
    }), 200


@api_bp.route('/users', methods=['GET'])
@login_required
def api_list_users():
    """List all users"""
    users = get_all_users()
    return jsonify({
        'success': True,
        'data': [
            {
                'id': user.id,
                'email': user.email,
                'created_at': user.created_at.isoformat() if user.created_at else None
            }
            for user in users
        ]
    }), 200


@api_bp.route('/users/<int:user_id>', methods=['PUT'])
@login_required
def api_update_user(user_id):
    """Update a user"""
    data = request.get_json()
    user = get_user_by_id(user_id)
    
    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404
    
    try:
        update_user(
            user_id=user_id,
            email=data.get('email'),
            password=data.get('password')
        )
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/users/<int:user_id>', methods=['DELETE'])
@login_required
def api_delete_user(user_id):
    """Delete a user"""
    user = get_user_by_id(user_id)
    
    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404
    
    try:
        delete_user(user_id)
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400
