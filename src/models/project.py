from . import db
from .associations import project_materials
from datetime import datetime

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime, nullable=True)
    is_complete = db.Column(db.Boolean, default=False)

    # Many-to-many relationship with materials
    materials = db.relationship('Material', secondary=project_materials, backref=db.backref('projects', lazy=True))

    created_by_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_by = db.relationship('User', backref=db.backref('projects', lazy=True))

    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    def __repr__(self):
        return f'<Project {self.name}>'


# Project CRUD functions
def get_all_projects(sort_by=None, filter_completed=None, created_by_id=None):
    query = Project.query
    
    # Filter by creator if provided
    if created_by_id is not None:
        query = query.filter(Project.created_by_id == created_by_id)
    
    if filter_completed == 'completed':
        query = query.filter(Project.end_date.isnot(None))
    elif filter_completed == 'active':
        query = query.filter(Project.end_date.is_(None))
    
    if sort_by == 'title':
        query = query.order_by(Project.name.asc())
    elif sort_by == 'created_at':
        query = query.order_by(Project.created_at.desc())
    elif sort_by == 'updated_at':
        query = query.order_by(Project.updated_at.desc())
    elif sort_by == 'start_date':
        # Handle nulls by putting them at the end
        query = query.order_by(Project.start_date.asc().nullslast())
    else:
        # Default sort: newest first (by created_at)
        query = query.order_by(Project.created_at.desc())
    
    return query.all()

def get_project_by_id(project_id):
    return Project.query.get(project_id)

def create_project(name, description, start_date=None, end_date=None, created_by_id=None):
    project = Project(name=name, description=description, created_by_id=created_by_id)
    if start_date:
        project.start_date = datetime.strptime(start_date, '%Y-%m-%d')
    if end_date:
        project.end_date = datetime.strptime(end_date, '%Y-%m-%d')
    db.session.add(project)
    db.session.commit()
    return project

def update_project(project_id, name=None, description=None, start_date=None, end_date=None, is_complete=None):
    project = get_project_by_id(project_id)
    if project:
        if name:
            project.name = name
        if description is not None:
            project.description = description
        if start_date is not None:
            if isinstance(start_date, str):
                project.start_date = datetime.strptime(start_date, '%Y-%m-%d') if start_date else None
            else:
                project.start_date = start_date
        if end_date is not None:
            if isinstance(end_date, str):
                project.end_date = datetime.strptime(end_date, '%Y-%m-%d') if end_date else None
            else:
                project.end_date = end_date
        if is_complete is not None:
            project.is_complete = is_complete
        db.session.commit()
    return project

def delete_project(project_id):
    project = get_project_by_id(project_id)
    if project:
        db.session.delete(project)
        db.session.commit()
        return True
    return False

def add_material_to_project(project_id, material_id):
    project = get_project_by_id(project_id)
    from .material import get_material_by_id
    material = get_material_by_id(material_id)
    if project and material:
        if material not in project.materials:
            project.materials.append(material)
            db.session.commit()
            return True
    return False

def remove_material_from_project(project_id, material_id):
    project = get_project_by_id(project_id)
    from .material import get_material_by_id
    material = get_material_by_id(material_id)
    if project and material:
        if material in project.materials:
            project.materials.remove(material)
            db.session.commit()
            return True
    return False

def get_materials_for_project(project_id):
    project = get_project_by_id(project_id)
    return project.materials if project else []

def get_projects_for_material(material_id):
    from .material import get_material_by_id
    material = get_material_by_id(material_id)
    return material.projects if material else []
