from flask import Blueprint, render_template, request, redirect, url_for, jsonify, session
from .auth import login_required
from ..models.contact import get_all_contacts, create_contact, update_contact, delete_contact

contacts_bp = Blueprint('contacts', __name__)

@contacts_bp.route('/contacts')
@login_required
def contacts():
    sort_by = request.args.get('sort', 'name')
    user_id = session.get('user_id')
    contacts_list = get_all_contacts(sort_by, created_by_id=user_id)
    return render_template('contacts.html', contacts=contacts_list, current_sort=sort_by)

@contacts_bp.route('/contacts', methods=['POST'])
@login_required
def create_contact_route():
    name = request.form.get('name')
    email = request.form.get('email')
    phone = request.form.get('phone')
    website = request.form.get('website')
    notes = request.form.get('notes')
    is_store = request.form.get('is_store') == 'on'
    user_id = session.get('user_id')
    
    if name:
        create_contact(name, email, phone, notes, is_store, created_by_id=user_id)
    return redirect(url_for('contacts.contacts'))

@contacts_bp.route('/api/contacts/<int:contact_id>', methods=['PUT'])
@login_required
def api_update_contact(contact_id):
    data = request.get_json()
    
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    website = data.get('website')
    notes = data.get('notes')
    is_store = data.get('is_store', False)
    
    if name:
        update_contact(contact_id, name, email, phone, None, notes, is_store)
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'Name is required'})

@contacts_bp.route('/contact/<int:contact_id>/delete', methods=['POST'])
@login_required
def delete_contact_route(contact_id):
    delete_contact(contact_id)
    return redirect(url_for('contacts.contacts'))
