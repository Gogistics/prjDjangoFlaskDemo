# -*- coding: utf-8 -*-
def task_data():
  """ Minification Task """
  tasks = [{ 'name': 'update Bower packages and files\' paths in base.htm',
            'actions': ['cd ./static && bower install && cd ../',
                        'node update_bower_packages.js']},
            { 'name' : 'minify js scripts',
            'actions': ['python -m jsmin ./static/js/scripts.js > ./static/js/scripts.min.js'],
          },{ 'name': 'minify css styles',
              'actions': ['python -m csscompressor -o ./static/css/styles.min.css ./static/css/styles.css'],
          },{ 'name': 'minify html templates',
              'actions': ['htmlmin ./templates/index.htm > ./templates/index.html',
                          'htmlmin ./templates/base.htm > ./templates/base.html',
                          'htmlmin ./templates/success.htm > ./templates/success.html',
                          'htmlmin ./templates/my_ng_templates/banner.htm > ./templates/my_ng_templates/banner.html',
                          'htmlmin ./templates/my_ng_templates/footer.htm > ./templates/my_ng_templates/footer.html',
                          'htmlmin ./templates/my_ng_templates/section-1.htm > ./templates/my_ng_templates/section-1.html',
                          'htmlmin ./templates/my_ng_templates/section-2.htm > ./templates/my_ng_templates/section-2.html',
                          'htmlmin ./templates/my_ng_templates/section-3.htm > ./templates/my_ng_templates/section-3.html'],
          }]
  for task in tasks:
    yield task