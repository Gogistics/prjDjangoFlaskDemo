### For Demo

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

app@my_vm:web_django/$ docker build -t app_flask:latest .

app@my_vm:web_django/$ docker run --name my_django -v $(pwd):/app -p 5001:8000 -d app_flask:latest
```

===

SocketIO

===

Ref.

[Flask with Angular.js](https://gist.github.com/jstacoder/863a5df5d7bb76c88323)

[Dockerize Simple Flask App](http://containertutorials.com/docker-compose/flask-simple-app.html#requirements-file)

[Making a Flask app using a PostgreSQL database and deploying to Heroku](http://blog.sahildiwan.com/posts/flask-and-postgresql-app-deployed-on-heroku/)

[Flask-SocketIO](https://flask-socketio.readthedocs.io/en/latest/)

[Flask-SocketIO/example](https://github.com/miguelgrinberg/Flask-SocketIO/tree/master/example)

[AngularJS + D3 Demos](https://github.com/vicapow/angular-d3-talk/tree/master/slides/demos)

[SVG Paths and D3.js](https://www.dashingd3js.com/svg-paths-and-d3js)

[D3 Transition](https://bost.ocks.org/mike/transition/)

[Applying a colour gradient to a graph line with D3.js](http://www.d3noob.org/2013/01/applying-colour-gradient-to-graph-line.html)

[SVG Tutorial](http://www.w3schools.com/graphics/svg_intro.asp)

[D3 extent](http://bl.ocks.org/phoebebright/3061203)