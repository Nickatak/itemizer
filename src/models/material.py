from . import db
from .associations import material_tags, material_contacts

class Material(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, default=0.0)
    link = db.Column(db.String(500))
    specification_notes = db.Column(db.Text)
    is_purchased = db.Column(db.Boolean, default=False)
    
    # Many-to-many relationship with tags
    tags = db.relationship('Tag', secondary=material_tags, backref=db.backref('materials', lazy=True))
    
    # Many-to-many relationship with contacts
    contacts = db.relationship('Contact', secondary=material_contacts, backref=db.backref('materials', lazy=True))

    created_by_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_by = db.relationship('User', backref=db.backref('materials', lazy=True))

    created_at = db.Column(db.DateTime, default=db.func.now())

    def __repr__(self):
        return f'<Material {self.name}>'


# Material CRUD functions
def get_all_materials(created_by_id=None):
    query = Material.query
    if created_by_id is not None:
        query = query.filter(Material.created_by_id == created_by_id)
    return query.all()

def get_material_by_id(material_id):
    return Material.query.get(material_id)

def create_material(name, description, price=None, link=None, specification_notes=None, created_by_id=None):
    material = Material(name=name, description=description, price=price, link=link, specification_notes=specification_notes, created_by_id=created_by_id)
    db.session.add(material)
    db.session.commit()
    return material

def update_material(material_id, name=None, description=None, price=None, link=None, specification_notes=None):
    material = get_material_by_id(material_id)
    if material:
        if name is not None:
            material.name = name
        if description is not None:
            material.description = description
        if price is not None:
            material.price = price
        if link is not None:
            material.link = link
        if specification_notes is not None:
            material.specification_notes = specification_notes
        db.session.commit()
    return material

def delete_material(material_id):
    material = get_material_by_id(material_id)
    if material:
        db.session.delete(material)
        db.session.commit()
        return True
    return False

def add_tag_to_material(material_id, tag_id):
    material = get_material_by_id(material_id)
    from .tag import get_tag_by_id
    tag = get_tag_by_id(tag_id)
    if material and tag and tag not in material.tags:
        material.tags.append(tag)
        db.session.commit()

def remove_tag_from_material(material_id, tag_id):
    material = get_material_by_id(material_id)
    from .tag import get_tag_by_id
    tag = get_tag_by_id(tag_id)
    if material and tag and tag in material.tags:
        material.tags.remove(tag)
        db.session.commit()

def add_contact_to_material(material_id, contact_id):
    material = get_material_by_id(material_id)
    from .contact import get_contact_by_id
    contact = get_contact_by_id(contact_id)
    if material and contact and contact not in material.contacts:
        material.contacts.append(contact)
        db.session.commit()

def remove_contact_from_material(material_id, contact_id):
    material = get_material_by_id(material_id)
    from .contact import get_contact_by_id
    contact = get_contact_by_id(contact_id)
    if material and contact and contact in material.contacts:
        material.contacts.remove(contact)
        db.session.commit()
