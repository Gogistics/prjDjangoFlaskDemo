# -*- coding: utf-8 -*-
from flask_socketio import SocketIO, emit
import random

class MySocketIO(object):
  ''' SocketIO Route '''
  def __init__(self, app):
    self.__async_mode = None
    self.__thread = None
    self.__socketio = SocketIO(app, async_mode = self.__async_mode)

    # example 
    def background_thread():
      """Example of how to send server generated events to clients."""
      count = 0
      while True:
        self.__socketio.sleep(1)
        count += 1
        self.__socketio.emit('my_realtime_data', {'data': 'Server generated event', 'count': count, 'random_number': random.randint(1,10)}, namespace='/test')

    # socket routes
    @self.__socketio.on('connect', namespace='/test')
    def test_connect():
      print('client connected')

      # example of background task for front-end real-time chart
      if self.__thread is None:
        self.__thread = self.__socketio.start_background_task(target = background_thread)
      
      emit('my_response', {'data': 'Connected'})

    @self.__socketio.on('disconnect', namespace='/test')
    def test_disconnect():
      print('client disconnected')

    @self.__socketio.on('my_event', namespace='/test')
    def test_message(message):
      print('<--- my_event of socketio --->')
      print str(message)
      emit('my_response', {'data': message['data']})

  def get_socketio(self):
    return self.__socketio