from . import db


class ProjectMaterial(db.Model):
    """Association object for many-to-many relationship between Project and Material."""
    __tablename__ = 'project_materials'
    
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), primary_key=True)
    material_id = db.Column(db.Integer, db.ForeignKey('material.id'), primary_key=True)
    order = db.Column(db.Integer, default=0)
    count = db.Column(db.Integer, default=1)
    is_purchased = db.Column(db.Boolean, default=False)
    
    # Relationships
    material = db.relationship('Material', back_populates='projects')
    project = db.relationship('Project', back_populates='materials')
    
    def __repr__(self):
        return f'<ProjectMaterial project_id={self.project_id} material_id={self.material_id} order={self.order} count={self.count} is_purchased={self.is_purchased}>'


# Association table for many-to-many relationship between Task and Contact
task_contacts = db.Table('task_contacts',
    db.Column('task_id', db.Integer, db.ForeignKey('task.id'), primary_key=True),
    db.Column('contact_id', db.Integer, db.ForeignKey('contact.id'), primary_key=True)
)

# Association table for many-to-many relationship between Material and Contact
material_contacts = db.Table('material_contacts',
    db.Column('material_id', db.Integer, db.ForeignKey('material.id'), primary_key=True),
    db.Column('contact_id', db.Integer, db.ForeignKey('contact.id'), primary_key=True)
)
