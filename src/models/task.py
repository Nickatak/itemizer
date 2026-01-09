from . import db
from .associations import task_contacts

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)

    is_completed = db.Column(db.Boolean, default=False)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    
    difficulty = db.Column(db.String(50))
    completion_percentage = db.Column(db.Integer, default=0)
    order = db.Column(db.Integer, default=0, autoincrement=True)

    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    project = db.relationship('Project', backref=db.backref('tasks', lazy=True))
    
    created_by_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_by = db.relationship('User', backref=db.backref('tasks', lazy=True))
    
    # Many-to-many relationship with contacts
    contacts = db.relationship('Contact', secondary=task_contacts, backref=db.backref('tasks', lazy=True))

    def __repr__(self):
        return f'<Task {self.name}>'


# Task CRUD functions
def get_all_tasks():
    return Task.query.all()

def get_task_by_id(task_id):
    return Task.query.get(task_id)

def create_task(name, description, project_id, is_completed=False, start_date=None, end_date=None, difficulty=None, completion_percentage=0, created_by_id=None):
    task = Task(name=name, description=description, project_id=project_id, is_completed=is_completed, start_date=start_date, end_date=end_date, difficulty=difficulty, completion_percentage=completion_percentage, created_by_id=created_by_id)
    db.session.add(task)
    db.session.commit()
    return task

def update_task(task_id, name=None, description=None, is_completed=None, start_date=None, end_date=None, difficulty=None, completion_percentage=None):
    task = get_task_by_id(task_id)
    if task:
        if name is not None:
            task.name = name
        if description is not None:
            task.description = description
        if is_completed is not None:
            task.is_completed = is_completed
        if start_date is not None:
            task.start_date = start_date
        if end_date is not None:
            task.end_date = end_date
        if difficulty is not None:
            task.difficulty = difficulty
        if completion_percentage is not None:
            task.completion_percentage = completion_percentage
        db.session.commit()
    return task

def delete_task(task_id):
    task = get_task_by_id(task_id)
    if task:
        db.session.delete(task)
        db.session.commit()
        return True
    return False
