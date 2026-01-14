from flask import request, jsonify, session
from ..auth import login_required
from ...models.category import create_category, get_all_categories
from ...models import db
from . import api_bp


@api_bp.route('/categories', methods=['POST'])
@login_required
def api_create_category():
    """Create a new category"""
    data = request.get_json()
    user_id = session.get('user_id')
    
    try:
        category = create_category(
            name=data.get('name'),
            created_by_id=user_id
        )
        return jsonify({
            'success': True, 
            'category': {
                'id': category.id,
                'name': category.name
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400
