# -*- coding: utf-8 -*-

class CeleryConfig(object):
  """docstring for CeleryConfig"""
  def __init__(self, arg):
    super(CeleryConfig, self).__init__()
    self.arg = arg

    self.__queue_name = 'task'
    self.__backend = 'amqp'
    self.__user_broker = 'guest'
    self.__ip_broker = '172.17.0.4'
    self.__port_broker = 5672

  def get_queue_name(self):
    return self.__queue_name

  def get_backend(self):
    return self.__backend

  def get_url_broker(self):
    url = ( 'amqp://{user_broker}'
            '@{ip_broker}'
            ':{port_broker}//' ).format( user_broker = self.__user_broker,
                                        ip_broker = self.__ip_broker,
                                        port_broker = self.__port_broker )
    return url