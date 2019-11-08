import os

STAGE = os.getenv("STAGE", "production")

if STAGE == "production":
   from .production import *
elif STAGE == "local":
   from .local import *
elif STAGE == "staging":
   from .staging import *
