# -*- coding: utf-8 -*-

class PostgresConfig(object):
  """docstring for PostgresConfig"""
  def __init__(self, arg):
    super(PostgresConfig, self).__init__()
    self.arg = arg

    self.__ip_general = '172.17.0.2'
    self.__port_general = 5432
    self.__db_general = 'myproject'
    self.__user_general = 'myprojectuser'
    self.__user_pwd_general = 'helloDjango'

  def get_url_general(self):
    url = ( 'postgres://{user_general}'
            ':{user_pwd_general}'
            '@{ip_general}'
            ':{port_general}'
            '/{db_general}' ).format( ip_general = self.__ip_general,
                                      port_general = self.__port_general,
                                      db_general = self.__db_general,
                                      user_general = self.__user_general,
                                      user_pwd_general = self.__user_pwd_general )
    return url
