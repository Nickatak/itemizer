from flask import request, jsonify, session
from ..auth import login_required
from ...models.project import (
    create_project, get_project_by_id, update_project, delete_project, get_all_projects
)
from ...models import db
from . import api_bp
from .api_interface import (
    serialize_project, serialize_project_summary, parse_project_data, parse_project_patch_data,
    get_project_materials, get_project_tasks, add_material_to_project_api, remove_material_from_project_api,
    serialize_material
)


@api_bp.route('/projects', methods=['POST'])
@login_required
def api_create_project():
    """Create a new project"""
    data = request.get_json()
    
    try:
        project_data = parse_project_data(data)
        project_data['created_by_id'] = session.get('user_id')
        project = create_project(**project_data)
        db.session.commit()
        return jsonify({'success': True, 'id': project.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/projects/<int:project_id>', methods=['GET'])
@login_required
def api_get_project(project_id):
    """Get a single project by ID"""
    project = get_project_by_id(project_id)
    if not project:
        return jsonify({'success': False, 'error': 'Project not found'}), 404
    
    return jsonify({
        'success': True,
        'data': serialize_project(project)
    }), 200


@api_bp.route('/projects', methods=['GET'])
@login_required
def api_list_projects():
    """List all projects with sorting and filtering"""
    sort_by = request.args.get('sort', 'created_at')
    filter_completed = request.args.get('filter', 'all')
    user_id = session.get('user_id')
    
    projects = get_all_projects(sort_by=sort_by, filter_completed=filter_completed, created_by_id=user_id)
    return jsonify({
        'success': True,
        'data': [serialize_project_summary(project) for project in projects]
    }), 200


@api_bp.route('/projects/<int:project_id>', methods=['PUT'])
@login_required
def api_update_project(project_id):
    """Update a project"""
    data = request.get_json()
    project = get_project_by_id(project_id)
    
    if not project:
        return jsonify({'success': False, 'error': 'Project not found'}), 404
    
    try:
        project_data = parse_project_data(data)
        update_project(project_id=project_id, **project_data)
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/projects/<int:project_id>', methods=['PATCH'])
@login_required
def api_patch_project(project_id):
    """Partially update a project"""
    data = request.get_json()
    project = get_project_by_id(project_id)
    
    if not project:
        return jsonify({'success': False, 'error': 'Project not found'}), 404
    
    try:
        update_data = parse_project_patch_data(data)
        if update_data:
            update_project(project_id=project_id, **update_data)
            db.session.commit()
        
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/projects/<int:project_id>', methods=['DELETE'])
@login_required
def api_delete_project(project_id):
    """Delete a project"""
    project = get_project_by_id(project_id)
    
    if not project:
        return jsonify({'success': False, 'error': 'Project not found'}), 404
    
    try:
        delete_project(project_id)
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/projects/<int:project_id>/materials', methods=['GET'])
@login_required
def api_get_project_materials(project_id):
    """Get all materials for a project"""
    result = get_project_materials(project_id)
    if not result:
        return jsonify({'success': False, 'error': 'Project not found'}), 404
    
    return jsonify({
        'success': True,
        'data': result['materials'],
        'total_count': result['total_count'],
        'total_cost': result['total_cost']
    }), 200


@api_bp.route('/projects/<int:project_id>/available-materials', methods=['GET'])
@login_required
def api_get_available_materials(project_id):
    """Get materials NOT attached to a project"""
    project = get_project_by_id(project_id)
    if not project:
        return jsonify({'success': False, 'error': 'Project not found'}), 404
    
    # Get limit from query parameters (default 5)
    limit = request.args.get('limit', 3, type=int)
    
    # Get all materials
    from ...models.material import get_all_materials
    all_materials = get_all_materials()
    
    # Get attached material IDs from ProjectMaterial relationships
    attached_ids = {pm.material_id for pm in project.materials}
    
    # Filter to only unattached materials
    available = [m for m in all_materials if m.id not in attached_ids]
    
    # Sort by last_used (most recent first)
    available.sort(key=lambda m: m.last_used if m.last_used else m.created_at, reverse=True)
    
    # Limit results
    available = available[:limit]
    
    # Serialize
    serialized = [serialize_material(m) for m in available]
    
    return jsonify({
        'success': True,
        'data': serialized
    }), 200


@api_bp.route('/projects/<int:project_id>/tasks', methods=['GET'])
@login_required
def api_get_project_tasks(project_id):
    """Get all tasks for a project"""
    result = get_project_tasks(project_id)
    if not result:
        return jsonify({'success': False, 'error': 'Project not found'}), 404
    
    return jsonify({
        'success': True,
        'data': result['tasks'],
        'total_count': result['total_count']
    }), 200


@api_bp.route('/projects/<int:project_id>/add-material/<int:material_id>', methods=['POST'])
@login_required
def api_add_material_to_project(project_id, material_id):
    """Add a material to a project"""
    result, error = add_material_to_project_api(project_id, material_id)
    
    if not result:
        if error == 'Project not found':
            return jsonify({'success': False, 'error': 'Project not found'}), 404
        elif error == 'Material not found':
            return jsonify({'success': False, 'error': 'Material not found'}), 404
        else:
            return jsonify({'success': False, 'error': error}), 400
    
    return jsonify({'success': True}), 200


@api_bp.route('/projects/<int:project_id>/remove-material/<int:material_id>', methods=['POST'])
@login_required
def api_remove_material_from_project(project_id, material_id):
    """Remove a material from a project"""
    result, error = remove_material_from_project_api(project_id, material_id)
    
    if not result:
        if error == 'Project not found':
            return jsonify({'success': False, 'error': 'Project not found'}), 404
        elif error == 'Material not found':
            return jsonify({'success': False, 'error': 'Material not found'}), 404
        else:
            return jsonify({'success': False, 'error': error}), 400
    
    return jsonify({'success': True}), 200
