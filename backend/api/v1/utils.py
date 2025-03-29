"""Utilities fuctions for v1
"""

import uuid
import random
from string import ascii_lowercase

token_id = "tms_"


def generate_token() -> str:
    """Generates api token"""
    return token_id + str(uuid.uuid4()).replace("-", random.choice(ascii_lowercase))


def get_value(optional, default):
    return optional if optional is not None else default
