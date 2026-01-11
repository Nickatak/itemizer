from flask import request, jsonify
from ..auth import login_required
from ...models.task import (
    create_task, get_task_by_id, update_task, delete_task, get_all_tasks
)
from ...models import db
from datetime import datetime
from . import api_bp


@api_bp.route('/tasks', methods=['POST'])
@login_required
def api_create_task():
    """Create a new task"""
    data = request.get_json()
    
    try:
        task = create_task(
            name=data.get('name'),
            description=data.get('description'),
            project_id=data.get('project_id'),
            is_completed=data.get('is_completed', False),
            start_date=datetime.fromisoformat(data['start_date']) if data.get('start_date') else None,
            end_date=datetime.fromisoformat(data['end_date']) if data.get('end_date') else None,
            difficulty=data.get('difficulty'),
            completion_percentage=data.get('completion_percentage', 0),
            created_by_id=data.get('created_by_id')
        )
        db.session.commit()
        return jsonify({'success': True, 'id': task.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/tasks/<int:task_id>', methods=['GET'])
@login_required
def api_get_task(task_id):
    """Get a single task by ID"""
    task = get_task_by_id(task_id)
    if not task:
        return jsonify({'success': False, 'error': 'Task not found'}), 404
    
    return jsonify({
        'success': True,
        'data': {
            'id': task.id,
            'name': task.name,
            'description': task.description,
            'project_id': task.project_id,
            'is_completed': task.is_completed,
            'start_date': task.start_date.isoformat() if task.start_date else None,
            'end_date': task.end_date.isoformat() if task.end_date else None,
            'difficulty': task.difficulty,
            'completion_percentage': task.completion_percentage,
            'created_at': task.created_at.isoformat() if task.created_at else None,
            'updated_at': task.updated_at.isoformat() if task.updated_at else None
        }
    }), 200


@api_bp.route('/tasks', methods=['GET'])
@login_required
def api_list_tasks():
    """List all tasks"""
    tasks = get_all_tasks()
    return jsonify({
        'success': True,
        'data': [
            {
                'id': task.id,
                'name': task.name,
                'description': task.description,
                'project_id': task.project_id,
                'is_completed': task.is_completed,
                'difficulty': task.difficulty,
                'completion_percentage': task.completion_percentage
            }
            for task in tasks
        ]
    }), 200


@api_bp.route('/tasks/<int:task_id>', methods=['PUT'])
@login_required
def api_update_task(task_id):
    """Update a task"""
    data = request.get_json()
    task = get_task_by_id(task_id)
    
    if not task:
        return jsonify({'success': False, 'error': 'Task not found'}), 404
    
    try:
        update_task(
            task_id=task_id,
            name=data.get('name'),
            description=data.get('description'),
            is_completed=data.get('is_completed'),
            start_date=datetime.fromisoformat(data['start_date']) if data.get('start_date') else None,
            end_date=datetime.fromisoformat(data['end_date']) if data.get('end_date') else None,
            difficulty=data.get('difficulty'),
            completion_percentage=data.get('completion_percentage')
        )
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@login_required
def api_delete_task(task_id):
    """Delete a task"""
    task = get_task_by_id(task_id)
    
    if not task:
        return jsonify({'success': False, 'error': 'Task not found'}), 404
    
    try:
        delete_task(task_id)
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400
