# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, session
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta
from flask_socketio import SocketIO, emit
from base64 import b64encode
import os, time, random
from models.user_models import UserModelsManager

app = Flask(__name__)
app.secret_key = b64encode(os.urandom(32)).decode('utf-8')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

# set socketio
async_mode = None
thread = None
socketio = SocketIO(app, async_mode = async_mode)

# example 
def background_thread():
  """Example of how to send server generated events to clients."""
  count = 0
  while True:
    socketio.sleep(1)
    count += 1
    socketio.emit('my_realtime_data', {'data': 'Server generated event', 'count': count, 'random_number': random.randint(1,10)}, namespace='/test')


# set connection with postgres
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://myprojectuser:helloDjango@172.17.0.2:5432/myproject'
db = SQLAlchemy(app)
UserModelsManager = UserModelsManager(db)
User = UserModelsManager.get_user_model() # get User model


# routes
@app.route('/')
def index():
  if 'auth_base' not in session:
    session['auth_base'] = {'permission': 1, 'tkn': b64encode(os.urandom(12)).decode('utf-8')}
    app.permanent_session_lifetime = timedelta(minutes=360)
    
  print '<--- session --->'
  print str(session['auth_base'])
  return render_template('index.html', async_mode = socketio.async_mode)

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

# route of getting partial/sub templates
@app.route('/my_ng_templates/<sub_template>')
def partial(sub_template):
  template_path = 'my_ng_templates/{sub_template}'.format(sub_template = sub_template)
  return render_template(template_path, jinja_var='jinja sub-template')

# socket
@socketio.on('connect', namespace='/test')
def test_connect():
  print('client connected')

  # example of background task for front-end real-time chart
  global thread
  if thread is None:
    thread = socketio.start_background_task(target = background_thread)
  
  emit('my_response', {'data': 'Connected'})

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
  print('client disconnected')

@socketio.on('my_event', namespace='/test')
def test_message(message):
  print('<--- my_event of socketio --->')
  print str(message)
  emit('my_response', {'data': message['data']})

# entry
if __name__ == '__main__':
  # app.run(debug=True,host='0.0.0.0',port=5000)
  socketio.run(app, host='0.0.0.0', port=5000, debug=True)