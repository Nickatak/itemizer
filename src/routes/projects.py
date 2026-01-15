from flask import Blueprint, render_template, request, redirect, url_for, session
from .auth import login_required
from ..models.project import get_all_projects, create_project, get_project_by_id, update_project, delete_project, add_material_to_project, remove_material_from_project
from ..models.material import get_all_materials
from ..models.contact import get_all_contacts

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/projects')
@login_required
def projects():
    return render_template('projects.html')

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
    return render_template('partials/project_details/project_detail.html', project=project, materials=materials, contacts=contacts, categories=categories)
