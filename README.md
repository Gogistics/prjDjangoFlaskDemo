
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

Ref.

[How To Set Up Django with Postgres, Nginx, and Gunicorn on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-16-04)

[dj_static](https://github.com/kennethreitz/dj-static)
