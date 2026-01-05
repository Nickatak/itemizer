from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import all models and associations
from .associations import project_materials, material_tags, task_contacts, material_contacts
from .material import Material
from .project import Project
from .task import Task
from .tag import Tag
from .contact import Contact

__all__ = ['db', 'Material', 'Project', 'Task', 'Tag', 'Contact', 
           'project_materials', 'material_tags', 'task_contacts', 'material_contacts']
