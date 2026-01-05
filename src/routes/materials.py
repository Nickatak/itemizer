from flask import Blueprint, request, redirect, url_for, jsonify
import json
from ..models.material import (
    get_all_materials, get_material_by_id, create_material, 
    update_material, add_tag_to_material, remove_tag_from_material, add_contact_to_material
)
from ..models.project import add_material_to_project, remove_material_from_project
from ..models.tag import create_tag
from ..models.contact import create_contact

materials_bp = Blueprint('materials', __name__)

@materials_bp.route('/project/<int:project_id>/add_material/<int:material_id>', methods=['POST'])
def add_material_to_project_route(project_id, material_id):
    add_material_to_project(project_id, material_id)
    return redirect(url_for('projects.project_detail', project_id=project_id))

@materials_bp.route('/project/<int:project_id>/remove_material/<int:material_id>', methods=['POST'])
def remove_material_from_project_route(project_id, material_id):
    remove_material_from_project(project_id, material_id)
    return redirect(url_for('projects.project_detail', project_id=project_id))

@materials_bp.route('/materials', methods=['POST'])
def create_material_route():
    name = request.form.get('name')
    description = request.form.get('description')
    price = request.form.get('price')
    link = request.form.get('link')
    specification_notes = request.form.get('specification_notes')
    project_id = request.form.get('project_id')
    tags = request.form.getlist('tags')
    new_tags = request.form.getlist('new_tags[]')
    
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
        material = create_material(name, description, price_float, link, specification_notes)
        
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
                
                new_contact = create_contact(new_contact_name, email=new_contact_email, phone=new_contact_phone, is_store=is_store)
                add_contact_to_material(material.id, new_contact.id)
        
        # Create and add new tags
        new_tag_mapping = {}
        for new_tag_json in new_tags:
            try:
                new_tag_data = json.loads(new_tag_json)
                tag = create_tag(new_tag_data['name'], new_tag_data['color'])
                new_tag_mapping[new_tag_data['id']] = tag.id
            except (json.JSONDecodeError, KeyError, ValueError):
                pass
        
        # Add existing tags to material
        for tag_id in tags:
            try:
                if tag_id.startswith('new_'):
                    # Map new tag IDs to created tag IDs
                    actual_tag_id = new_tag_mapping.get(tag_id)
                    if actual_tag_id:
                        add_tag_to_material(material.id, actual_tag_id)
                else:
                    add_tag_to_material(material.id, int(tag_id))
            except (ValueError, TypeError):
                pass
        
        if project_id:
            add_material_to_project(int(project_id), material.id)
    return redirect(url_for('projects.project_detail', project_id=project_id))

@materials_bp.route('/api/materials/<int:material_id>', methods=['PUT'])
def api_update_material(material_id):
    data = request.get_json()
    
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    link = data.get('link')
    specification_notes = data.get('specification_notes')
    tags = data.get('tags', [])
    new_tags = data.get('new_tags', [])

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
            
            # Get current material
            material = get_material_by_id(material_id)
            
            # Remove all existing tags
            for tag in list(material.tags):
                remove_tag_from_material(material_id, tag.id)
            
            # Create and add new tags
            new_tag_mapping = {}
            for new_tag_data in new_tags:
                try:
                    tag = create_tag(new_tag_data['name'], new_tag_data['color'])
                    new_tag_mapping[new_tag_data['id']] = tag.id
                except (KeyError, ValueError):
                    pass
            
            # Add selected tags to material
            for tag_id in tags:
                try:
                    if isinstance(tag_id, str) and tag_id.startswith('new_'):
                        # Map new tag IDs to created tag IDs
                        actual_tag_id = new_tag_mapping.get(tag_id)
                        if actual_tag_id:
                            add_tag_to_material(material_id, actual_tag_id)
                    else:
                        add_tag_to_material(material_id, int(tag_id))
                except (ValueError, TypeError):
                    pass
            
            return jsonify({'success': True, 'message': 'Material updated successfully'})
        else:
            return jsonify({'success': False, 'error': 'Material name is required'}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
