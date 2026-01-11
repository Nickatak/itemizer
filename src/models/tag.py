from . import db

class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    color = db.Column(db.String(7), default='#00ff88')  # hex color code
    
    created_by_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_by = db.relationship('User', backref=db.backref('tags', lazy=True))

    def __repr__(self):
        return f'<Tag {self.name}>'


# Tag CRUD functions
def get_all_tags(created_by_id=None):
    query = Tag.query
    if created_by_id is not None:
        query = query.filter(Tag.created_by_id == created_by_id)
    return query.all()

def get_tag_by_id(tag_id):
    return Tag.query.get(tag_id)

def get_tag_by_name(name):
    return Tag.query.filter_by(name=name).first()

def create_tag(name, color='#00ff88', created_by_id=None):
    tag = Tag(name=name, color=color, created_by_id=created_by_id)
    db.session.add(tag)
    db.session.commit()
    return tag

def update_tag(tag_id, name=None, color=None):
    tag = get_tag_by_id(tag_id)
    if tag:
        if name is not None:
            tag.name = name
        if color is not None:
            tag.color = color
        db.session.commit()
    return tag

def delete_tag(tag_id):
    tag = get_tag_by_id(tag_id)
    if tag:
        db.session.delete(tag)
        db.session.commit()
        return True
    return False
