
### For Demo

To be continued...

##### Default MySQL Setting

```
app@my_vm:/$ cd prjDjangoFlask/web_django/

app@my_vm:web_django/$ docker run --name my_mysql -e MYSQL_ROOT_PASSWORD=Django168 -d mysql
```

##### Default Postgres Setting
db: postgres

user: postgres

pwd: Django168

```
app@my_vm:/$ cd prjDjangoFlask/web_django/

app@my_vm:web_django/$ docker run --name my_postgres -e POSTGRES_PASSWORD=Django168 -d mdillon/postgis
```

##### DB User
db: myproject

user: myprojectuser

pwd: helloDjango

##### Admin
admin: gogistics

pwd: Django168

```
app@my_vm:/$ cd prjDjangoFlask/web_django/

app@my_vm:web_django/$ docker build -t app_django:latest .

app@my_vm:web_django/$ docker run --name my_django -v $(pwd):/app -p 5001:8000 -d app_django:latest
```

To start a new App

  1. Start an App

  ```
  app@my_vm:/$ cd prjDjangoFlask/web_django/

  app@my_vm:web_django/$ python manage.py startapp app_1
  ```

  2. Update views.py

  3. Update urls.py


===

SocketIO

  1. Update Dockerfile

  2. Update **INSTALLED_APPS** of settings.py

  3. **apps.py** of app_1

===

Ref.

[How To Set Up Django with Postgres, Nginx, and Gunicorn on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-16-04)

[How to Deploy Python WSGI Apps Using Gunicorn HTTP Server Behind Nginx](https://www.digitalocean.com/community/tutorials/how-to-deploy-python-wsgi-apps-using-gunicorn-http-server-behind-nginx)

[dj_static](https://github.com/kennethreitz/dj-static)

[Django Tutorial](http://riceball.com/d/content/django-18-minimal-application-using-generic-class-based-views)

[Python Getting Started](https://github.com/heroku/python-getting-started/)

[How to make AngularJS and Django play nice together](http://www.daveoncode.com/2013/10/17/how-to-make-angularjs-and-django-play-nice-together/)

[django-socket-server](https://django-socket-server.readthedocs.io/en/latest/readme.html#quickstart)
