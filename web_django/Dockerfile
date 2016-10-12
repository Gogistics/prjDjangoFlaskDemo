FROM ubuntu:latest

# maintainer
MAINTAINER Alan Tai "gogistics@gogistics-tw.com"

RUN apt-get update -y
RUN apt-get install -y python-pip python-dev libpq-dev libevent-dev postgresql postgresql-contrib build-essential git
RUN pip install --upgrade pip
RUN pip install django==1.8 gunicorn psycopg2 dj-static psycogreen
RUN pip install -e git+https://github.com/abourget/gevent-socketio.git\#egg=gevent_socketio-dev

# copy files into container and change dir
COPY . /app
WORKDIR /app

# ./manage.py createsuperuser
RUN ./manage.py makemigrations && ./manage.py migrate

# start Django with Gunicorn and use dj_static to serve static files
# CMD gunicorn --bind 0.0.0.0:8000 myproject.wsgi:application
CMD gunicorn -c gunicorn_config.py myproject.wsgi:application
