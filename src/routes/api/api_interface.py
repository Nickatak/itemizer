"""
API Interface Functions
Handles data transformation, serialization, and business logic for API routes
"""

from datetime import datetime
from ...models import db
from ...models.project import get_project_by_id, add_material_to_project, remove_material_from_project
from ...models.material import get_material_by_id


# ===== Task API Interface Functions =====

def serialize_task(task):
    """Convert task object to API response format"""
    return {
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


def serialize_task_summary(task):
    """Convert task object to summary API response format"""
    return {
        'id': task.id,
        'name': task.name,
        'description': task.description,
        'project_id': task.project_id,
        'is_completed': task.is_completed,
        'difficulty': task.difficulty,
        'completion_percentage': task.completion_percentage
    }


def serialize_task_for_project(task):
    """Convert task object to project view format"""
    return {
        'id': task.id,
        'name': task.name,
        'description': task.description,
        'is_completed': task.is_completed,
        'start_date': task.start_date.isoformat() if task.start_date else None,
        'end_date': task.end_date.isoformat() if task.end_date else None,
        'difficulty': task.difficulty,
        'completion_percentage': task.completion_percentage or 0,
        'order': task.order,
        'created_at': task.created_at.isoformat() if task.created_at else None
    }


def parse_task_data(data):
    """Parse and validate task data from request"""
    return {
        'name': data.get('name'),
        'description': data.get('description'),
        'project_id': data.get('project_id'),
        'is_completed': data.get('is_completed', False),
        'start_date': datetime.fromisoformat(data['start_date']) if data.get('start_date') else None,
        'end_date': datetime.fromisoformat(data['end_date']) if data.get('end_date') else None,
        'difficulty': data.get('difficulty'),
        'completion_percentage': data.get('completion_percentage', 0)
    }


def get_project_tasks(project_id):
    """Get all tasks for a project with serialization"""
    project = get_project_by_id(project_id)
    if not project:
        return None
    
    tasks_data = [serialize_task_for_project(task) for task in project.tasks]
    return {
        'tasks': tasks_data,
        'total_count': len(tasks_data)
    }


# ===== Material API Interface Functions =====

def serialize_material(material):
    """Convert material object to API response format"""
    return {
        'id': material.id,
        'name': material.name,
        'description': material.description,
        'price': float(material.price) if material.price else None,
        'link': material.link,
        'specification_notes': material.specification_notes,
        'category': {
            'id': material.category.id,
            'name': material.category.name,
            'color': material.category.color
        } if material.category else None,
        'created_at': material.created_at.isoformat() if material.created_at else None,
        'last_used': material.last_used.isoformat() if material.last_used else None
    }


def serialize_material_summary(material):
    """Convert material object to summary API response format"""
    return {
        'id': material.id,
        'name': material.name,
        'description': material.description,
        'price': float(material.price) if material.price else None,
        'link': material.link
    }


def serialize_material_for_project(project_material):
    """Convert project material object to project view format"""
    material = project_material.material
    return {
        'id': material.id,
        'name': material.name,
        'description': material.description,
        'price': float(material.price) if material.price else None,
        'link': material.link,
        'specification_notes': material.specification_notes,
        'category': {
            'id': material.category.id,
            'name': material.category.name,
            'color': material.category.color
        } if material.category else None
    }


def parse_material_data(data):
    """Parse and validate material data from request"""
    return {
        'name': data.get('name'),
        'description': data.get('description'),
        'price': data.get('price'),
        'link': data.get('link'),
        'specification_notes': data.get('specification_notes'),
        'category_id': data.get('category_id')
    }


def get_project_materials(project_id):
    """Get all materials for a project with serialization"""
    project = get_project_by_id(project_id)
    if not project:
        return None
    
    materials_data = [serialize_material_for_project(pm) for pm in project.materials]
    total_cost = sum(pm.material.price or 0 for pm in project.materials)
    
    return {
        'materials': materials_data,
        'total_count': len(materials_data),
        'total_cost': float(total_cost)
    }


# ===== Project API Interface Functions =====

def serialize_project(project):
    """Convert project object to API response format"""
    return {
        'id': project.id,
        'name': project.name,
        'description': project.description,
        'start_date': project.start_date.isoformat() if project.start_date else None,
        'end_date': project.end_date.isoformat() if project.end_date else None,
        'is_complete': project.is_complete,
        'created_at': project.created_at.isoformat() if project.created_at else None,
        'updated_at': project.updated_at.isoformat() if project.updated_at else None
    }


def serialize_project_summary(project):
    """Convert project object to summary API response format"""
    return {
        'id': project.id,
        'name': project.name,
        'description': project.description,
        'is_complete': project.is_complete,
        'start_date': project.start_date.isoformat() if project.start_date else None,
        'end_date': project.end_date.isoformat() if project.end_date else None,
        'created_at': project.created_at.isoformat() if project.created_at else None,
        'updated_at': project.updated_at.isoformat() if project.updated_at else None
    }


def parse_project_data(data):
    """Parse and validate project data from request"""
    return {
        'name': data.get('name'),
        'description': data.get('description'),
        'start_date': datetime.fromisoformat(data['start_date']) if data.get('start_date') else None,
        'end_date': datetime.fromisoformat(data['end_date']) if data.get('end_date') else None
    }


def parse_project_patch_data(data):
    """Parse and validate partial project data from PATCH request"""
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
    return update_data


def add_material_to_project_api(project_id, material_id):
    """Add a material to a project with validation"""
    project = get_project_by_id(project_id)
    if not project:
        return None, 'Project not found'
    
    material = get_material_by_id(material_id)
    if not material:
        return None, 'Material not found'
    
    try:
        add_material_to_project(project_id, material_id)
        db.session.commit()
        return True, None
    except Exception as e:
        db.session.rollback()
        return None, str(e)


def remove_material_from_project_api(project_id, material_id):
    """Remove a material from a project with validation"""
    project = get_project_by_id(project_id)
    if not project:
        return None, 'Project not found'
    
    material = get_material_by_id(material_id)
    if not material:
        return None, 'Material not found'
    
    try:
        remove_material_from_project(project_id, material_id)
        db.session.commit()
        return True, None
    except Exception as e:
        db.session.rollback()
        return None, str(e)
