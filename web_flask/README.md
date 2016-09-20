
### For Demo

##### Default MySQL Setting

```
app@my_vm:/$ cd prjDjangoFlask/web_django/

app@my_vm:web_django/$ docker run --name mysql_django -e MYSQL_ROOT_PASSWORD=Django168 -d mysql
```

##### Default Postgres Setting
db: postgres

user: postgres

pwd: Django168

```
app@my_vm:/$ cd prjDjangoFlask/web_django/

app@my_vm:web_django/$ docker run --name postgres_django:latest -e POSTGRES_PASSWORD=Django168 -d mdillon/postgis
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

app@my_vm:web_django/$ docker run --name my_django -p 5001:8000 -d app_django:latest

```

Ref.

[Flask with Angular.js](https://gist.github.com/jstacoder/863a5df5d7bb76c88323)

[Dockerize Simple Flask App](http://containertutorials.com/docker-compose/flask-simple-app.html#requirements-file)

[Making a Flask app using a PostgreSQL database and deploying to Heroku](http://blog.sahildiwan.com/posts/flask-and-postgresql-app-deployed-on-heroku/)