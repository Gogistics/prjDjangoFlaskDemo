# -*- coding: utf-8 -*-
from flask import Flask, render_template, request
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://myprojectuser:helloDjango@172.17.0.2:5432/myproject'
db = SQLAlchemy(app)

# db setting
# Create our database model
class User(db.Model):
  __tablename__ = "users"
  id = db.Column(db.Integer, primary_key=True)
  email = db.Column(db.String(120), unique=True)

  def __init__(self, email):
    self.email = email

  def __repr__(self):
    return '<E-mail %r>' % self.email

# create tables
db.create_all()
db.session.commit()

# routes
@app.route('/')
def index():
  return render_template('index.html')

@app.route('/prereg', methods = ['POST'])
def prereg():
  email = None
  if request.method == 'POST':
    email = request.form['email']

    if not db.session.query(User).filter(User.email == email).count():
      reg = User(email)
      db.session.add(reg)
      db.session.commit()
      return render_template('success.html')
  return render_template('index.html')

@app.route('/my_ng_templates/<sub_template>')
def partial(sub_template):
    template_path = 'my_ng_templates/{sub_template}'.format(sub_template = sub_template)
    return render_template(template_path, jinja_var='jinja sub-template')

# entry
if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=5000)
