from flask import Blueprint, request, redirect, url_for, jsonify, session
from datetime import datetime
from .auth import login_required
from ..models.task import create_task, get_task_by_id, update_task

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('/tasks', methods=['POST'])
@login_required
def create_task_route():
    name = request.form.get('name')
    description = request.form.get('description')
    project_id = request.form.get('project_id')
    is_completed = request.form.get('is_completed') == 'on'
    start_date = request.form.get('start_date')
    end_date = request.form.get('end_date')
    difficulty = request.form.get('difficulty')
    completion_percentage = request.form.get('completion_percentage')

    if name and project_id:
        # Convert dates if provided
        start_date_obj = None
        end_date_obj = None
        if start_date:
            start_date_obj = datetime.strptime(start_date, '%Y-%m-%d')
        if end_date:
            end_date_obj = datetime.strptime(end_date, '%Y-%m-%d')

        # Convert completion percentage
        completion_pct = 0
        if completion_percentage:
            try:
                completion_pct = int(completion_percentage)
            except ValueError:
                completion_pct = 0

        user_id = session.get('user_id')
        create_task(name, description, int(project_id), is_completed, start_date_obj, end_date_obj, difficulty, completion_pct, created_by_id=user_id)
    return redirect(url_for('projects.project_detail', project_id=project_id))

@tasks_bp.route('/api/tasks/<int:task_id>', methods=['PUT'])
@login_required
def api_update_task(task_id):
    data = request.get_json()
    
    task = get_task_by_id(task_id)
    if not task:
        return jsonify({'success': False, 'error': 'Task not found'}), 404
    
    try:
        name = data.get('name')
        description = data.get('description')
        is_completed = data.get('is_completed')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        difficulty = data.get('difficulty')
        completion_percentage = data.get('completion_percentage')
        
        # Convert dates if provided
        start_date_obj = None
        end_date_obj = None
        if start_date:
            start_date_obj = datetime.strptime(start_date, '%Y-%m-%d')
        if end_date:
            end_date_obj = datetime.strptime(end_date, '%Y-%m-%d')
        
        # Convert completion percentage
        completion_pct = None
        if completion_percentage is not None:
            try:
                completion_pct = int(completion_percentage)
            except (ValueError, TypeError):
                completion_pct = None
        
        update_task(task_id, name, description, is_completed, start_date_obj, end_date_obj, difficulty, completion_pct)
        
        return jsonify({'success': True, 'message': 'Task updated successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
