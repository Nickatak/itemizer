from flask import request, jsonify, session
from ..auth import login_required
from ...models.material import (
    create_material, get_material_by_id, update_material, delete_material, get_all_materials
)
from ...models import db
from . import api_bp
from .api_interface import serialize_material, serialize_material_summary, parse_material_data


@api_bp.route('/materials', methods=['POST'])
@login_required
def api_create_material():
    """Create a new material"""
    data = request.get_json()
    
    try:
        material_data = parse_material_data(data)
        material_data['created_by_id'] = session.get('user_id')
        material = create_material(**material_data)
        db.session.commit()
        return jsonify({'success': True, 'id': material.id, 'data': serialize_material(material)}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/materials/<int:material_id>', methods=['GET'])
@login_required
def api_get_material(material_id):
    """Get a single material by ID"""
    material = get_material_by_id(material_id)
    if not material:
        return jsonify({'success': False, 'error': 'Material not found'}), 404
    
    return jsonify({
        'success': True,
        'data': serialize_material(material)
    }), 200


@api_bp.route('/materials', methods=['GET'])
@login_required
def api_list_materials():
    """List all materials for current user"""
    user_id = session.get('user_id')
    materials = get_all_materials(created_by_id=user_id)
    return jsonify({
        'success': True,
        'data': [serialize_material(material) for material in materials]
    }), 200


@api_bp.route('/materials/<int:material_id>', methods=['PUT'])
@login_required
def api_update_material(material_id):
    """Update a material"""
    data = request.get_json()
    material = get_material_by_id(material_id)
    
    if not material:
        return jsonify({'success': False, 'error': 'Material not found'}), 404
    
    try:
        material_data = parse_material_data(data)
        # Remove None values to only update provided fields
        material_data = {k: v for k, v in material_data.items() if v is not None or k in data}
        update_material(material_id=material_id, **material_data)
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/materials/<int:material_id>', methods=['DELETE'])
@login_required
def api_delete_material(material_id):
    """Delete a material"""
    material = get_material_by_id(material_id)
    
    if not material:
        return jsonify({'success': False, 'error': 'Material not found'}), 404
    
    try:
        delete_material(material_id)
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400
