from flask import request, jsonify, session
from ..auth import login_required
from ...models.task import (
    create_task, get_task_by_id, update_task, delete_task, get_all_tasks, reorder_tasks
)
from ...models import db
from . import api_bp
from .api_interface import serialize_task, serialize_task_summary, serialize_task_for_project, parse_task_data


@api_bp.route('/tasks', methods=['POST'])
@login_required
def api_create_task():
    """Create a new task"""
    data = request.get_json()
    
    try:
        task_data = parse_task_data(data)
        task_data['created_by_id'] = session.get('user_id')
        task = create_task(**task_data)
        db.session.commit()
        return jsonify({'success': True, 'id': task.id, 'data': serialize_task_for_project(task)}), 201
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
        'data': serialize_task(task)
    }), 200


@api_bp.route('/tasks', methods=['GET'])
@login_required
def api_list_tasks():
    """List all tasks"""
    tasks = get_all_tasks()
    return jsonify({
        'success': True,
        'data': [serialize_task_summary(task) for task in tasks]
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
        task_data = parse_task_data(data)
        # Remove None values to only update provided fields
        task_data = {k: v for k, v in task_data.items() if v is not None or k in data}
        update_task(task_id=task_id, **task_data)
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@login_required
def api_delete_task(task_id):
    """Delete a task and reorder remaining tasks"""
    task = get_task_by_id(task_id)
    
    if not task:
        return jsonify({'success': False, 'error': 'Task not found'}), 404
    
    try:
        project_id = task.project_id
        delete_task(task_id)
        
        # Reorder remaining tasks in the project
        from ...models.project import get_project_by_id
        project = get_project_by_id(project_id)
        if project:
            # Get all remaining tasks sorted by order
            remaining_tasks = sorted(project.tasks, key=lambda t: t.order)
            # Reassign order numbers sequentially
            for index, remaining_task in enumerate(remaining_tasks, 1):
                remaining_task.order = index
        
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400


@api_bp.route('/projects/<int:project_id>/reorder-tasks', methods=['POST'])
@login_required
def api_reorder_tasks(project_id):
    """Reorder tasks within a project."""
    data = request.get_json()
    
    if not data or 'task_order' not in data:
        return jsonify({'success': False, 'error': 'Invalid request format'}), 400
    
    try:
        task_orders = data.get('task_order', [])
        reorder_tasks(task_orders)
        return jsonify({'success': True, 'message': 'Tasks reordered successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
