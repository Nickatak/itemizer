from flask import request, jsonify
from ..auth import login_required
from ...models.material import (
    create_material, get_material_by_id, update_material, delete_material, get_all_materials
)
from ...models import db
from . import api_bp


@api_bp.route('/materials', methods=['POST'])
@login_required
def api_create_material():
    """Create a new material"""
    data = request.get_json()
    
    try:
        material = create_material(
            name=data.get('name'),
            description=data.get('description'),
            price=data.get('price'),
            link=data.get('link'),
            specification_notes=data.get('specification_notes'),
            created_by_id=data.get('created_by_id')
        )
        db.session.commit()
        return jsonify({'success': True, 'id': material.id}), 201
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
        'data': {
            'id': material.id,
            'name': material.name,
            'description': material.description,
            'price': float(material.price) if material.price else None,
            'link': material.link,
            'specification_notes': material.specification_notes,
            'created_at': material.created_at.isoformat() if material.created_at else None,
            'updated_at': material.updated_at.isoformat() if material.updated_at else None
        }
    }), 200


@api_bp.route('/materials', methods=['GET'])
@login_required
def api_list_materials():
    """List all materials"""
    materials = get_all_materials()
    return jsonify({
        'success': True,
        'data': [
            {
                'id': material.id,
                'name': material.name,
                'description': material.description,
                'price': float(material.price) if material.price else None,
                'link': material.link
            }
            for material in materials
        ]
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
        update_material(
            material_id=material_id,
            name=data.get('name'),
            description=data.get('description'),
            price=data.get('price'),
            link=data.get('link'),
            specification_notes=data.get('specification_notes')
        )
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
