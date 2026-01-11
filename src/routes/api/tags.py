from flask import request, jsonify
from ..auth import login_required
from ...models.tag import (
    create_tag, get_tag_by_id, update_tag, delete_tag, get_all_tags
)
from ...models import db
from . import api_bp


@api_bp.route('/tags', methods=['POST'])
@login_required
def api_create_tag():
    """Create a new tag"""
    data = request.get_json()
    
    try:
        tag = create_tag(
            name=data.get('name'),
            color=data.get('color', '#00ff88'),
            created_by_id=data.get('created_by_id')
        )
        db.session.commit()
        return jsonify({'success': True, 'id': tag.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/tags/<int:tag_id>', methods=['GET'])
@login_required
def api_get_tag(tag_id):
    """Get a single tag by ID"""
    tag = get_tag_by_id(tag_id)
    if not tag:
        return jsonify({'success': False, 'error': 'Tag not found'}), 404
    
    return jsonify({
        'success': True,
        'data': {
            'id': tag.id,
            'name': tag.name,
            'color': tag.color,
            'created_at': tag.created_at.isoformat() if tag.created_at else None,
            'updated_at': tag.updated_at.isoformat() if tag.updated_at else None
        }
    }), 200


@api_bp.route('/tags', methods=['GET'])
@login_required
def api_list_tags():
    """List all tags"""
    tags = get_all_tags()
    return jsonify({
        'success': True,
        'data': [
            {
                'id': tag.id,
                'name': tag.name,
                'color': tag.color
            }
            for tag in tags
        ]
    }), 200


@api_bp.route('/tags/<int:tag_id>', methods=['PUT'])
@login_required
def api_update_tag(tag_id):
    """Update a tag"""
    data = request.get_json()
    tag = get_tag_by_id(tag_id)
    
    if not tag:
        return jsonify({'success': False, 'error': 'Tag not found'}), 404
    
    try:
        update_tag(
            tag_id=tag_id,
            name=data.get('name'),
            color=data.get('color')
        )
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/tags/<int:tag_id>', methods=['DELETE'])
@login_required
def api_delete_tag(tag_id):
    """Delete a tag"""
    tag = get_tag_by_id(tag_id)
    
    if not tag:
        return jsonify({'success': False, 'error': 'Tag not found'}), 404
    
    try:
        delete_tag(tag_id)
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400
