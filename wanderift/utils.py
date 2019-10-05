from datetime import datetime


def parse_isodatetime(dt):
    return datetime.strptime(dt, "%Y-%m-%dT%H:%M:%S.%fZ")
