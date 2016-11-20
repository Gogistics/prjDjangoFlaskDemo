### For Demo

##### Default MySQL Setting

```
app@my_vm:/$ cd prjDjangoFlask/web_flask/

app@my_vm:web_flask/$ docker run --name my_mysql -e MYSQL_ROOT_PASSWORD=Django168 -d mysql
```

##### Default Postgres Setting
db: postgres

user: postgres

pwd: Django168

```
app@my_vm:/$ cd prjDjangoFlask/web_flask/

app@my_vm:web_flask/$ docker run --name my_postgres -e POSTGRES_PASSWORD=Django168 -d mdillon/postgis
```

##### DB User
db: myproject

user: myprojectuser

pwd: helloDjango

##### Admin
admin: gogistics

pwd: Django168

```
app@my_vm:/$ cd prjDjangoFlask/web_flask/

app@my_vm:web_flask/$ docker build -t app_flask:latest .

app@my_vm:web_flask/$ docker run --name my_django -v $(pwd):/app -p 5001:8000 -d app_flask:latest
```

Create a dodo.py and execute the following command for tasks automation

```
app@my_vm:web_flask/$ doit

```


Implement RabbitMQ

```
app@my_vm:web_flask/$ docker run -d --hostname my-rabbit --name some-rabbit rabbitmq:3
```

===

SocketIO

===

Ref.

[Python Coding Style](https://www.python.org/dev/peps/pep-0008/)

[Code Style](http://docs.python-guide.org/en/latest/writing/style/)

[Flask with Angular.js](https://gist.github.com/jstacoder/863a5df5d7bb76c88323)

[Dockerize Simple Flask App](http://containertutorials.com/docker-compose/flask-simple-app.html#requirements-file)

[Making a Flask app using a PostgreSQL database and deploying to Heroku](http://blog.sahildiwan.com/posts/flask-and-postgresql-app-deployed-on-heroku/)

[Flask-SocketIO](https://flask-socketio.readthedocs.io/en/latest/)

[Flask-SocketIO/example](https://github.com/miguelgrinberg/Flask-SocketIO/tree/master/example)

[Redis-Py](https://redis-py.readthedocs.io/en/latest/)

[Flask-Session](https://pythonhosted.org/Flask-Session/)

[flask-redis](https://github.com/underyx/flask-redis)

[flask-multi-session](https://github.com/nbob/flask-multi-session)

[RedisSessionStore.py](https://gist.github.com/linnchord/1154472)

[How To Use Celery with RabbitMQ to Queue Tasks on an Ubuntu VPS](https://www.digitalocean.com/community/tutorials/how-to-use-celery-with-rabbitmq-to-queue-tasks-on-an-ubuntu-vps)

[RabbitMQ Docker Container](https://hub.docker.com/_/rabbitmq/)

[First Steps with Celery](http://docs.celeryproject.org/en/latest/getting-started/first-steps-with-celery.html#choosing-a-broker)

[AngularJS + D3 Demos](https://github.com/vicapow/angular-d3-talk/tree/master/slides/demos)

[SVG Paths and D3.js](https://www.dashingd3js.com/svg-paths-and-d3js)

[D3 Transition](https://bost.ocks.org/mike/transition/)

[Applying a colour gradient to a graph line with D3.js](http://www.d3noob.org/2013/01/applying-colour-gradient-to-graph-line.html)

[SVG Tutorial](http://www.w3schools.com/graphics/svg_intro.asp)

[D3 extent](http://bl.ocks.org/phoebebright/3061203)

[HTML5 Shiv](https://github.com/aFarkas/html5shiv)

[wiredep](https://github.com/taptapship/wiredep)