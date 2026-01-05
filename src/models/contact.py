from . import db

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=True)
    website = db.Column(db.String(200), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    is_store = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    def __repr__(self):
        return f'<Contact {self.name}>'


# Contact CRUD functions
def get_all_contacts(sort_by=None):
    query = Contact.query
    if sort_by == 'name':
        query = query.order_by(Contact.name)
    elif sort_by == 'created_at':
        query = query.order_by(Contact.created_at.desc())
    return query.all()

def get_contact_by_id(contact_id):
    return Contact.query.get(contact_id)

def create_contact(name, email=None, phone=None, notes=None, is_store=False):
    contact = Contact(name=name, email=email, phone=phone, notes=notes, is_store=is_store)
    db.session.add(contact)
    db.session.commit()
    return contact

def update_contact(contact_id, name=None, email=None, phone=None, address=None, notes=None, is_store=None):
    contact = get_contact_by_id(contact_id)
    if contact:
        if name is not None:
            contact.name = name
        if email is not None:
            contact.email = email
        if phone is not None:
            contact.phone = phone
        if notes is not None:
            contact.notes = notes
        if is_store is not None:
            contact.is_store = is_store
        db.session.commit()
    return contact

def delete_contact(contact_id):
    contact = get_contact_by_id(contact_id)
    if contact:
        db.session.delete(contact)
        db.session.commit()
        return True
    return False
