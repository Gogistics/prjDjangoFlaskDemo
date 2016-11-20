/* wiredep configuration */
require('wiredep')
({directory: './static/bower_components',
  src: './templates/base.htm',
  cwd: './static',
  fileTypes: {
    html: {
      replace: {
        js: '<script type="text/javascript" src="\{\{ url_for(\'static\', filename=\'{{filePath}}\') \}\}"></script>',
        css: '<link rel="stylesheet" href="\{\{ url_for(\'static\', filename=\'{{filePath}}\') \}\}"/>'
      }
    }
  },
  overrides: {
    'socket.io-client': {
      'main': ['socket.io.js']
    },
    'jquery-ui': {
      'main': ['jquery-ui.js', 'themes/base/jquery-ui.css']
    },
    'bootstrap': {
      'main': ['dist/js/bootstrap.js', 'dist/css/bootstrap.css']
    }
  },
});