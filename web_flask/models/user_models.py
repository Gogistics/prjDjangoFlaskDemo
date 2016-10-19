# -*- coding: utf-8 -*-
class UserModelsManager(object):
  ''' Manager of User Models'''
  def __init__(self, db):
    self.__db = db
    self.__db.create_all()
    self.__db.session.commit()

  def get_user_model(self):
    # Create our database model
    db = self.__db

    class User(db.Model):
      """ User model """
      __tablename__ = "users"
      id = db.Column(db.Integer, primary_key=True)
      email = db.Column(db.String(120), unique=True)

      def __init__(self, email):
        self.email = email

      def __repr__(self):
        return '<E-mail %r>' % self.email
    return User
