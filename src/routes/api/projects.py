from flask import request, jsonify, session
from ..auth import login_required
from ...models.project import (
    create_project, get_project_by_id, update_project, delete_project, get_all_projects
)
from ...models import db
from datetime import datetime
from . import api_bp


@api_bp.route('/projects', methods=['POST'])
@login_required
def api_create_project():
    """Create a new project"""
    data = request.get_json()
    
    try:
        project = create_project(
            name=data.get('name'),
            description=data.get('description'),
            start_date=datetime.fromisoformat(data['start_date']) if data.get('start_date') else None,
            end_date=datetime.fromisoformat(data['end_date']) if data.get('end_date') else None,
            is_complete=data.get('is_complete', False),
            created_by_id=data.get('created_by_id')
        )
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
        'data': {
            'id': project.id,
            'name': project.name,
            'description': project.description,
            'start_date': project.start_date.isoformat() if project.start_date else None,
            'end_date': project.end_date.isoformat() if project.end_date else None,
            'is_complete': project.is_complete,
            'created_at': project.created_at.isoformat() if project.created_at else None,
            'updated_at': project.updated_at.isoformat() if project.updated_at else None
        }
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
        'data': [
            {
                'id': project.id,
                'name': project.name,
                'description': project.description,
                'is_complete': project.is_complete,
                'start_date': project.start_date.isoformat() if project.start_date else None,
                'end_date': project.end_date.isoformat() if project.end_date else None,
                'created_at': project.created_at.isoformat() if project.created_at else None,
                'updated_at': project.updated_at.isoformat() if project.updated_at else None
            }
            for project in projects
        ]
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
        update_project(
            project_id=project_id,
            name=data.get('name'),
            description=data.get('description'),
            start_date=datetime.fromisoformat(data['start_date']) if data.get('start_date') else None,
            end_date=datetime.fromisoformat(data['end_date']) if data.get('end_date') else None,
            is_complete=data.get('is_complete')
        )
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
        # Only update fields that are provided in the request
        update_data = {}
        if 'name' in data:
            update_data['name'] = data['name']
        if 'description' in data:
            update_data['description'] = data['description']
        if 'start_date' in data:
            update_data['start_date'] = datetime.fromisoformat(data['start_date']) if data['start_date'] else None
        if 'end_date' in data:
            update_data['end_date'] = datetime.fromisoformat(data['end_date']) if data['end_date'] else None
        if 'is_complete' in data:
            update_data['is_complete'] = data['is_complete']
        
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
