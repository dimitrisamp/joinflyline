import os
from .base import *

if STAGE == "production":
   from .production import *
elif STAGE == "local":
   from .local import *
elif STAGE == "staging":
   from .staging import *
elif STAGE == "localprod":
   from .localprod import *
