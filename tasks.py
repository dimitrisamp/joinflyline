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
    c.run("docker-compose up -d")
    wait_for_pg()
    c.run("python manage.py migrate")


@task
def production_migrate_and_run(c):
    c.run("python manage.py migrate")
    c.run("python manage.py runserver")
