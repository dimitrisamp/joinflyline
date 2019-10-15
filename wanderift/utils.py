from itertools import tee
from datetime import datetime


def parse_isodatetime(dt):
    return datetime.strptime(dt, "%Y-%m-%dT%H:%M:%S.%fZ")


def pairwise(iterable):
    "s -> (s0,s1), (s1,s2), (s2, s3), ..."
    a, b = tee(iterable)
    next(b, None)
    return zip(a, b)
