from . import db

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=True)
    website = db.Column(db.String(200), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    is_store = db.Column(db.Boolean, default=False)
    
    created_by_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_by = db.relationship('User', backref=db.backref('contacts', lazy=True))
    
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    def __repr__(self):
        return f'<Contact {self.name}>'


# Contact CRUD functions
def get_all_contacts(sort_by=None, created_by_id=None):
    query = Contact.query
    if created_by_id is not None:
        query = query.filter(Contact.created_by_id == created_by_id)
    if sort_by == 'name':
        query = query.order_by(Contact.name)
    elif sort_by == 'created_at':
        query = query.order_by(Contact.created_at.desc())
    return query.all()

def get_contact_by_id(contact_id):
    return Contact.query.get(contact_id)

def create_contact(name, email=None, phone=None, website=None, notes=None, is_store=False, created_by_id=None):
    contact = Contact(name=name, email=email, phone=phone, website=website, notes=notes, is_store=is_store, created_by_id=created_by_id)
    db.session.add(contact)
    db.session.commit()
    return contact

def update_contact(contact_id, name=None, email=None, phone=None, website=None, notes=None, is_store=None):
    contact = get_contact_by_id(contact_id)
    if contact:
        if name is not None:
            contact.name = name
        if email is not None:
            contact.email = email
        if phone is not None:
            contact.phone = phone
        if website is not None:
            contact.website = website
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
