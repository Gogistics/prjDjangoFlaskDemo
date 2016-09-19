FROM ubuntu:latest

# maintainer
MAINTAINER Alan Tai "gogistics@gogistics-tw.com"

RUN apt-get update -y
RUN apt-get install -y python-pip python-dev libpq-dev postgresql postgresql-contrib build-essential
RUN pip install --upgrade pip
RUN pip install django gunicorn psycopg2 dj-static

# copy files into container and change dir
COPY . /app
WORKDIR /app

# ./manage.py createsuperuser
RUN ./manage.py makemigrations && ./manage.py migrate

# start Django with Gunicorn and use dj_static to serve static files
CMD gunicorn --bind 0.0.0.0:8000 myproject.wsgi:application
