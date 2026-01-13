from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import all models and associations
from .associations import task_contacts, material_contacts, ProjectMaterial
from .material import Material
from .project import Project
from .task import Task
from .contact import Contact
from .user import User
from .category import Category

__all__ = ['db', 'Material', 'Project', 'ProjectMaterial', 'Task', 'Contact', 'User', 'Category',
           'task_contacts', 'material_contacts']
