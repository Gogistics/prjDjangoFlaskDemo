# -*- coding: utf-8 -*-
from flask import Flask, session
from flask_redis import FlaskRedis
from flask_session.sessions import RedisSessionInterface
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta
from base64 import b64encode
from routes.socketio_routes import MySocketIO
from routes.partials_routes import MyPartials
from routes.index_routes import MyIndex
from celery import Celery
from config.my_redis import RedisConfig
from config.my_postgres import PostgresConfig
from config.my_celery import CeleryConfig
import os, time, redis

# set app
app = Flask(__name__)
secret_key = b64encode(os.urandom(32)).decode('utf-8')
app.secret_key = secret_key
app_name = 'FlaskApp'

# set redis
my_redis_config = RedisConfig(app_name)
app.config['REDIS_URL'] = my_redis_config.get_redis_url_general()
redis_store = FlaskRedis(app)

# set redis for session management
redis_storage = redis.Redis( host = my_redis_config.get_redis_ip_session(),
                            port = my_redis_config.get_redis_port_session(),
                            db = my_redis_config.get_redis_db_session(),
                            charset = my_redis_config.get_redis_charset_session() )

app.session_interface = RedisSessionInterface( redis = redis_storage,
                                              key_prefix = my_redis_config.get_key_prefix_session(),
                                              use_signer = True)

# set db connection with postgres
my_postgres_config = PostgresConfig(app_name)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = my_postgres_config.get_url_general()
db = SQLAlchemy(app)

# set all routes
my_socketio_routes = MySocketIO(app)
my_partials_routes = MyPartials(app)
my_index_routes = MyIndex(app, my_socketio_routes.get_socketio(), db, session, redis_store)

# set celery app
my_celery_config = CeleryConfig(app_name)
app_celery = Celery(my_celery_config.get_queue_name(), backend = my_celery_config.get_backend(), broker = my_celery_config.get_url_broker)

# entry
if __name__ == '__main__':
  # app.run(debug=True,host='0.0.0.0',port=5000) # run app without socketio
  my_socketio_routes.get_socketio().run(app, host='0.0.0.0', port=5000, debug=True)
