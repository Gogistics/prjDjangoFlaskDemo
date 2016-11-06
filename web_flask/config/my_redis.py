# -*- coding: utf-8 -*-

class RedisConfig(object):
  """docstring for RedisConfig"""
  def __init__(self, arg):
    super(RedisConfig, self).__init__()
    self.arg = arg

    self.__ip_general = '172.17.0.3'
    self.__port_general = 6379
    self.__db_general = 0

    self.__ip_session = '172.17.0.3'
    self.__port_session = 6379
    self.__db_session = 2
    self.__charset_session = 'utf-8'
    self.__key_prefix_session = 'session_flask:'

  def get_redis_url_general(self):
    url = ( 'redis://{ip_general}'
            ':{port_general}'
            '/{db_general}' ).format( ip_general = self.__ip_general,
                                      port_general = self.__port_general,
                                      db_general = self.__db_general )
    return url

  def get_redis_ip_session(self):
    return self.__ip_session

  def get_redis_port_session(self):
    return self.__port_session

  def get_redis_db_session(self):
    return self.__db_session

  def get_redis_charset_session(self):
    return self.__charset_session

  def get_key_prefix_session(self):
    return self.__key_prefix_session

