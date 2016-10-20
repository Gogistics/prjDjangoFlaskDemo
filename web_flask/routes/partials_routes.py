# -*- coding: utf-8 -*-
from flask import render_template

class MyPartials(object):
  def __init__(self, app):
    self.__app = app

    # route of getting partial/sub templates
    @self.__app.route('/my_ng_templates/<sub_template>')
    def partial(sub_template):
      template_path = 'my_ng_templates/{sub_template}'.format(sub_template = sub_template)
      return render_template(template_path, jinja_var='jinja sub-template')
