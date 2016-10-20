# -*- coding: utf-8 -*-
from flask import render_template, request
from base64 import b64encode
from datetime import timedelta
from models.user_models import UserModelsManager
import os

class MyIndex(object):
  ''' Index Routes '''

  def __init__(self, app, socketio, db, session, redis_store):
    self.__app = app
    self.__socketio = socketio
    self.__db = db
    self.__session = session
    self.__redis_store = redis_store
    self.__UserModelsManager = UserModelsManager(db)
    self.__User = self.__UserModelsManager.get_user_model() # get User model

    # route of getting partial/sub templates
    @self.__app.route('/')
    def index():
      tkn = b64encode(os.urandom(32)).decode('utf-8')
      if 'auth_base' not in self.__session:
        self.__session['auth_base'] = {'permission': 1, 'tkn': tkn}
        app.permanent_session_lifetime = timedelta(minutes=360)

      if not self.__redis_store.get(tkn):
        self.__redis_store.set(tkn, {'permission': 1, 'cookie': request.cookies}, 3600)
      resp = self.__app.make_response(render_template('index.html', messages = {'auth_info': self.__redis_store.get(tkn), 'session': self.__session['auth_base'], 'userTKN': request.cookies.get('userTKN', None)}))
      resp.set_cookie('userTKN', tkn) # userTKN changes for new request

      return resp

    @self.__app.route('/prereg', methods = ['POST'])
    def prereg():
      email = None
      if request.method == 'POST':
        email = request.form['email']

        if not self.__db.session.query(self.__User).filter(self.__User.email == email).count():
          reg = self.__User(email)
          self.__db.session.add(reg)
          self.__db.session.commit()
          return render_template('success.html')
      return render_template('index.html')