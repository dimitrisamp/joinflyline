import json
import pathlib
import random
import string
from itertools import tee
from datetime import datetime, date
from django.utils.timezone import utc


AIRLINE_CODES = json.load(open(pathlib.Path(__file__).parent / 'airline_codes.json'))


def parse_isodatetime(dt):
    return datetime.strptime(dt, "%Y-%m-%dT%H:%M:%S.%fZ").astimezone(utc)


def pairwise(iterable):
    "s -> (s0,s1), (s1,s2), (s2, s3), ..."
    a, b = tee(iterable)
    next(b, None)
    return zip(a, b)


def l2q(l):
    return '{}:{}'.format(l['type'], l['code'])


def generate_invite_code():
    choose_from = string.ascii_letters + string.digits
    return ''.join([random.choice(choose_from) for _ in range(20)])


def get_category(passenger):
    born = datetime.strptime(passenger["birthday"], "%Y-%m-%d")
    today = date.today()
    age = today.year - born.year - ((today.month, today.day) < (born.month, born.day))
    if age < 3:
        return "infants"
    elif age < 13:
        return "children"
    else:
        return "adults"
