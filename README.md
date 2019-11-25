### Quick start

Install Docker on your machine
Prepare virtualenv and activate it
```shell script
git checkout develop
cp .env.example .env
pip install -r requirements.txt
inv reset
python manage.py runserver
```
