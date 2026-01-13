from flask import Blueprint, request, redirect, url_for, jsonify, session, render_template
import json
from .auth import login_required
from ..models.material import (
    get_all_materials, get_material_by_id, create_material, 
    update_material, add_contact_to_material, delete_material
)
from ..models.project import add_material_to_project
from ..models.contact import create_contact

materials_bp = Blueprint('materials', __name__)

@materials_bp.route('/materials')
@login_required
def materials_dashboard():
    user_id = session.get('user_id')
    materials = get_all_materials(created_by_id=user_id)
    return render_template('materials.html', materials=materials)

@materials_bp.route('/material/<int:material_id>/delete', methods=['POST'])
@login_required
def delete_material_route(material_id):
    delete_material(material_id)
    return redirect(url_for('materials.materials_dashboard'))

@materials_bp.route('/materials', methods=['POST'])
@login_required
def create_material_route():
    name = request.form.get('name')
    description = request.form.get('description')
    price = request.form.get('price')
    link = request.form.get('link')
    specification_notes = request.form.get('specification_notes')
    project_id = request.form.get('project_id')
    
    # Contact handling
    contact_option = request.form.get('contact_option', 'none')
    contact_id = None
    
    if name:
        # Convert price to float if provided
        price_float = None
        if price:
            try:
                price_float = float(price)
            except ValueError:
                price_float = None
        user_id = session.get('user_id')
        material = create_material(name, description, price_float, link, specification_notes, created_by_id=user_id)
        
        # Handle contact creation or selection
        if contact_option == 'select':
            contact_id = request.form.get('contact_id')
            if contact_id:
                try:
                    add_contact_to_material(material.id, int(contact_id))
                except (ValueError, TypeError):
                    pass
        elif contact_option == 'create':
            new_contact_name = request.form.get('new_contact_name')
            if new_contact_name:
                new_contact_email = request.form.get('new_contact_email')
                new_contact_phone = request.form.get('new_contact_phone')
                is_store = request.form.get('new_contact_is_store') == 'on'
                
                new_contact = create_contact(new_contact_name, email=new_contact_email, phone=new_contact_phone, is_store=is_store, created_by_id=user_id)
                add_contact_to_material(material.id, new_contact.id)
        
        if project_id:
            add_material_to_project(int(project_id), material.id)
    return redirect(url_for('projects.project_detail', project_id=project_id))

@materials_bp.route('/api/materials/<int:material_id>', methods=['PUT'])
@login_required
def api_update_material(material_id):
    data = request.get_json()
    
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    link = data.get('link')
    specification_notes = data.get('specification_notes')

    # Convert price to float if provided
    price_float = None
    if price:
        try:
            price_float = float(price)
        except (ValueError, TypeError):
            price_float = None

    try:
        if name:
            update_material(material_id, name, description, price_float, link, specification_notes)

            return jsonify({'success': True, 'message': 'Material updated successfully'})
        else:
            return jsonify({'success': False, 'error': 'Material name is required'}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
