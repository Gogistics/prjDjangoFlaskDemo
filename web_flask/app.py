# -*- coding: utf-8 -*-
from flask import Flask, session
from flask_redis import FlaskRedis
from flask_session.sessions import RedisSessionInterface
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta
from base64 import b64encode
import os, time, redis
from routes.socketio_routes import MySocketIO
from routes.partials_routes import MyPartials
from routes.index_routes import MyIndex
from celery import Celery

# set app
app = Flask(__name__)
secret_key = b64encode(os.urandom(32)).decode('utf-8')
app.secret_key = secret_key

# set redis
app.config['REDIS_URL'] = 'redis://172.17.0.3:6379/0'
redis_store = FlaskRedis(app)

# set redis for session management
redis_storage = redis.Redis( host='172.17.0.3', port=6379, db=2, charset='utf-8')
app.session_interface = RedisSessionInterface(redis=redis_storage, key_prefix='session_flask:', use_signer=True)

# set db connection with postgres
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://myprojectuser:helloDjango@172.17.0.2:5432/myproject'
db = SQLAlchemy(app)

# set all routes
my_socketio_routes = MySocketIO(app)
my_partials_routes = MyPartials(app)
my_index_routes = MyIndex(app, my_socketio_routes.get_socketio(), db, session, redis_store)

# set celery app
app_celery = Celery('taks', backend = 'amqp', broker = 'amqp://guest@172.17.0.4:5672//')

# entry
if __name__ == '__main__':
  # app.run(debug=True,host='0.0.0.0',port=5000) # run app without socketio
  my_socketio_routes.get_socketio().run(app, host='0.0.0.0', port=5000, debug=True)
