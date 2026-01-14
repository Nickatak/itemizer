# API Routes package initialization
from flask import Blueprint

# Create main API blueprint
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Import individual API route modules
from . import projects
from . import tasks
from . import materials
from . import contacts
from . import users
from . import categories

# This file serves as the central registration point for all API routes
