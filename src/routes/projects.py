from flask import Blueprint, render_template, request, redirect, url_for, session
from .auth import login_required
from ..models.project import get_all_projects, create_project, get_project_by_id, update_project, delete_project, add_material_to_project, remove_material_from_project
from ..models.material import get_all_materials
from ..models.contact import get_all_contacts

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/projects')
@login_required
def projects():
    sort_by = request.args.get('sort', 'created_at')
    filter_completed = request.args.get('filter', 'active')
    user_id = session.get('user_id')
    projects = get_all_projects(sort_by, filter_completed, created_by_id=user_id)
    return render_template('projects.html', projects=projects, current_sort=sort_by, current_filter=filter_completed)

@projects_bp.route('/projects', methods=['POST'])
@login_required
def create_project_route():
    name = request.form.get('name')
    description = request.form.get('description')
    start_date = request.form.get('start_date')
    end_date = request.form.get('end_date')
    user_id = session.get('user_id')
    if name:
        create_project(name, description, start_date, end_date, created_by_id=user_id)
    return redirect(url_for('projects.projects'))

@projects_bp.route('/project/<int:project_id>')
@login_required
def project_detail(project_id):
    project = get_project_by_id(project_id)
    if not project:
        return render_template('404.html'), 404
    user_id = session.get('user_id')
    materials = get_all_materials(created_by_id=user_id)
    contacts = get_all_contacts(created_by_id=user_id)
    from ..models.category import get_all_categories
    # Get both user categories and system default categories
    user_categories = get_all_categories(created_by_id=user_id)
    system_categories = get_all_categories(created_by_id=2)  # System user ID is 2
    categories = user_categories + system_categories
    categories.sort(key=lambda c: c.name.lower())
    return render_template('project_detail.html', project=project, materials=materials, contacts=contacts, categories=categories)

@projects_bp.route('/project/<int:project_id>/delete', methods=['POST'])
@login_required
def delete_project_route(project_id):
    delete_project(project_id)
    return redirect(url_for('projects.projects'))

@projects_bp.route('/project/<int:project_id>/add_material/<int:material_id>', methods=['POST'])
@login_required
def add_material_to_project_route(project_id, material_id):
    add_material_to_project(project_id, material_id)
    return redirect(url_for('projects.project_detail', project_id=project_id))

@projects_bp.route('/project/<int:project_id>/remove_material/<int:material_id>', methods=['POST'])
@login_required
def remove_material_from_project_route(project_id, material_id):
    remove_material_from_project(project_id, material_id)
    return redirect(url_for('projects.project_detail', project_id=project_id))

@projects_bp.route('/api/projects/<int:project_id>/reorder-tasks', methods=['POST'])
@login_required
def reorder_tasks_route(project_id):
    """API endpoint to reorder tasks within a project."""
    data = request.get_json()
    
    if not data or 'task_order' not in data:
        return jsonify({'success': False, 'error': 'Invalid request format'}), 400
    
    try:
        task_orders = data.get('task_order', [])
        reorder_tasks(project_id, task_orders)
        return jsonify({'success': True, 'message': 'Tasks reordered successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
