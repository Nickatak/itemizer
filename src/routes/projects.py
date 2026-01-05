from flask import Blueprint, render_template, request, redirect, url_for
from ..models.project import get_all_projects, create_project, get_project_by_id, update_project
from ..models.material import get_all_materials
from ..models.tag import get_all_tags
from ..models.contact import get_all_contacts

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/projects')
def projects():
    sort_by = request.args.get('sort', 'created_at')
    filter_completed = request.args.get('filter', 'all')
    projects = get_all_projects(sort_by, filter_completed)
    return render_template('projects.html', projects=projects, current_sort=sort_by, current_filter=filter_completed)

@projects_bp.route('/projects', methods=['POST'])
def create_project_route():
    name = request.form.get('name')
    description = request.form.get('description')
    start_date = request.form.get('start_date')
    end_date = request.form.get('end_date')
    if name:
        create_project(name, description, start_date, end_date)
    return redirect(url_for('projects.projects'))

@projects_bp.route('/project/<int:project_id>')
def project_detail(project_id):
    project = get_project_by_id(project_id)
    if not project:
        return render_template('404.html'), 404
    materials = get_all_materials()
    tags = get_all_tags()
    contacts = get_all_contacts()
    return render_template('project_detail.html', project=project, materials=materials, tags=tags, contacts=contacts)

@projects_bp.route('/edit-project/<int:project_id>')
def edit_project(project_id):
    project = get_project_by_id(project_id)
    if not project:
        return render_template('404.html'), 404
    return render_template('edit_project.html', project=project)

@projects_bp.route('/edit-project/<int:project_id>', methods=['POST'])
def update_project_route(project_id):
    name = request.form.get('name')
    description = request.form.get('description')
    start_date = request.form.get('start_date')
    end_date = request.form.get('end_date')
    is_complete = request.form.get('is_complete') == 'on'
    
    if name:
        db_update_project(project_id, name, description, start_date, end_date, is_complete)
    return redirect(url_for('projects.project_detail', project_id=project_id))
