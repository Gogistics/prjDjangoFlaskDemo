FROM ubuntu:latest

MAINTAINER Alan Tai "gogistics@gogistics-tw.com"

RUN apt-get update -y
RUN apt-get install -y python-pip python-dev libpq-dev postgresql postgresql-contrib build-essential
RUN pip install --upgrade pip
RUN pip install Flask psycopg2 Flask-SQLAlchemy Flask-Session flask-socketio flask-redis

COPY . /app
WORKDIR /app

ENTRYPOINT ["python"]
CMD ["app.py"]
