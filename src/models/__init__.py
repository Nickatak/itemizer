from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import all models and associations
from .associations import material_tags, task_contacts, material_contacts, ProjectMaterial
from .material import Material
from .project import Project
from .task import Task
from .tag import Tag
from .contact import Contact
from .user import User

__all__ = ['db', 'Material', 'Project', 'ProjectMaterial', 'Task', 'Tag', 'Contact', 'User',
           'material_tags', 'task_contacts', 'material_contacts']
