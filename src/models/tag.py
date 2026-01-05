from . import db

class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    color = db.Column(db.String(7), default='#667eea')  # hex color code

    def __repr__(self):
        return f'<Tag {self.name}>'


# Tag CRUD functions
def get_all_tags():
    return Tag.query.all()

def get_tag_by_id(tag_id):
    return Tag.query.get(tag_id)

def get_tag_by_name(name):
    return Tag.query.filter_by(name=name).first()

def create_tag(name, color='#667eea'):
    tag = Tag(name=name, color=color)
    db.session.add(tag)
    db.session.commit()
    return tag
