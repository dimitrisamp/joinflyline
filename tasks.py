import os

import dotenv
dotenv.load_dotenv()

from invoke import task
from wanderift.wait import wait_for_pg


@task
def up(c):
    c.run("docker-compose up -d")

@task
def stop(c):
    c.run("docker-compose down")


@task
def down(c):
    c.run("docker-compose down -v")


@task
def reset(c):
    c.run("docker-compose down -v")
    c.run("docker-compose up -d postgres redis")
    wait_for_pg()
    c.run("python manage.py migrate")
    c.run("python manage.py create_example_data")
    c.run("docker-compose up -d worker")


@task
def production_run(c):
    c.run("gunicorn -c wanderift/gunicorn_config.py wanderift.wsgi", pty=True)


@task
def worker(c):
    c.run("celery worker -A wanderift -l info", pty=True)
