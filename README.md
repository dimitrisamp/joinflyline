### Quick start

Install Docker on your machine
You will need Python 3.7. Prepare virtualenv and activate it with these commands
```shell script
python -m venv venv
. venv/bin/activate
# Or venv/scripts/activate if you are on windows

```
```shell script
git checkout develop
cp .env.example.example .env.example
pip install -r requirements.txt
inv reset
python manage.py runserver
```

### Frontend
There are 2 options on how to work with project.
1) Build frontend and use single Django development server
2) Start frontend development server 
Option 1 is good if you are doing changes on backend side only
Option 2 is good if you are frontend developer.

Build frontend and use lone Django server
```shell script
cd frontend
npm install
npm run build
```
That will populate optimized versions of libraries into `/dist` folder and put static assets into `/dist/static`.
The `/dist` directory is set as template source and `/dist/static` is set as static dir, so they will be served nicely
from Django development server.

Use frontend Vue server
If you wish to use all the best features of frontend you should use the following commands:
```shell script
npm install
npm run serve
```
This will enable live-reloading and other features.
You will need to run Django server in parallel to be able to serve API requests
