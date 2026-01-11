from flask import request, jsonify
from ..auth import login_required
from ...models.contact import (
    create_contact, get_contact_by_id, update_contact, delete_contact, get_all_contacts
)
from ...models import db
from . import api_bp


@api_bp.route('/contacts', methods=['POST'])
@login_required
def api_create_contact():
    """Create a new contact"""
    data = request.get_json()
    
    try:
        contact = create_contact(
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone'),
            website=data.get('website'),
            notes=data.get('notes'),
            is_store=data.get('is_store', False),
            created_by_id=data.get('created_by_id')
        )
        db.session.commit()
        return jsonify({'success': True, 'id': contact.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/contacts/<int:contact_id>', methods=['GET'])
@login_required
def api_get_contact(contact_id):
    """Get a single contact by ID"""
    contact = get_contact_by_id(contact_id)
    if not contact:
        return jsonify({'success': False, 'error': 'Contact not found'}), 404
    
    return jsonify({
        'success': True,
        'data': {
            'id': contact.id,
            'name': contact.name,
            'email': contact.email,
            'phone': contact.phone,
            'website': contact.website,
            'notes': contact.notes,
            'is_store': contact.is_store,
            'created_at': contact.created_at.isoformat() if contact.created_at else None,
            'updated_at': contact.updated_at.isoformat() if contact.updated_at else None
        }
    }), 200


@api_bp.route('/contacts', methods=['GET'])
@login_required
def api_list_contacts():
    """List all contacts"""
    contacts = get_all_contacts()
    return jsonify({
        'success': True,
        'data': [
            {
                'id': contact.id,
                'name': contact.name,
                'email': contact.email,
                'phone': contact.phone,
                'is_store': contact.is_store
            }
            for contact in contacts
        ]
    }), 200


@api_bp.route('/contacts/<int:contact_id>', methods=['PUT'])
@login_required
def api_update_contact(contact_id):
    """Update a contact"""
    data = request.get_json()
    contact = get_contact_by_id(contact_id)
    
    if not contact:
        return jsonify({'success': False, 'error': 'Contact not found'}), 404
    
    try:
        update_contact(
            contact_id=contact_id,
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone'),
            website=data.get('website'),
            notes=data.get('notes'),
            is_store=data.get('is_store')
        )
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/contacts/<int:contact_id>', methods=['DELETE'])
@login_required
def api_delete_contact(contact_id):
    """Delete a contact"""
    contact = get_contact_by_id(contact_id)
    
    if not contact:
        return jsonify({'success': False, 'error': 'Contact not found'}), 404
    
    try:
        delete_contact(contact_id)
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400
