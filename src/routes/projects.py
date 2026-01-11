from flask import Blueprint, render_template, request, redirect, url_for, session
from .auth import login_required
from ..models.project import get_all_projects, create_project, get_project_by_id, update_project, delete_project, add_material_to_project, remove_material_from_project
from ..models.material import get_all_materials
from ..models.tag import get_all_tags
from ..models.contact import get_all_contacts

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/projects')
@login_required
def projects():
    sort_by = request.args.get('sort', 'created_at')
    filter_completed = request.args.get('filter', 'all')
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
    tags = get_all_tags(created_by_id=user_id)
    contacts = get_all_contacts(created_by_id=user_id)
    return render_template('project_detail.html', project=project, materials=materials, tags=tags, contacts=contacts)

@projects_bp.route('/edit-project/<int:project_id>')
@login_required
def edit_project(project_id):
    project = get_project_by_id(project_id)
    if not project:
        return render_template('404.html'), 404
    return render_template('edit_project.html', project=project)

@projects_bp.route('/edit-project/<int:project_id>', methods=['POST'])
@login_required
def update_project_route(project_id):
    name = request.form.get('name')
    description = request.form.get('description')
    start_date = request.form.get('start_date')
    end_date = request.form.get('end_date')
    is_complete = request.form.get('is_complete') == 'on'
    
    if name:
        update_project(project_id, name, description, start_date, end_date, is_complete)
    return redirect(url_for('projects.project_detail', project_id=project_id))

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
