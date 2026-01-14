from . import db

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    color = db.Column(db.String(7), default='#00ff88')

    created_by_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_by = db.relationship('User', backref=db.backref('categories', lazy=True))
    
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    def __repr__(self):
        return f'<Category {self.name}>'


# Category CRUD functions
def get_all_categories(created_by_id=None):
    query = Category.query
    if created_by_id is not None:
        query = query.filter(Category.created_by_id == created_by_id)
    return query.all()

def get_category_by_id(category_id):
    return Category.query.get(category_id)

def create_category(name, created_by_id=None, color='#00ff88'):
    category = Category(name=name,  created_by_id=created_by_id, color=color)
    db.session.add(category)
    db.session.commit()
    return category

def update_category(category_id, name=None, description=None, color=None):
    category = get_category_by_id(category_id)
    if category:
        if name is not None:
            category.name = name
        if description is not None:
            category.description = description
        if color is not None:
            category.color = color
        db.session.commit()
    return category

def delete_category(category_id):
    category = get_category_by_id(category_id)
    if category:
        db.session.delete(category)
        db.session.commit()
        return True
    return False
