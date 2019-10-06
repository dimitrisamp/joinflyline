from django import template
from django.utils import dateparse


def time_interval(value):
    x = dateparse.parse_datetime(value['utc_departure'])
    y = dateparse.parse_datetime(value['utc_arrival'])
    z = y-x
    return secs2hm(z.seconds)


def secs2hm(value):
    total_minutes = int(value / 60)
    minutes = total_minutes % 60
    total_hours = int(total_minutes / 60)
    hours = total_hours % 24
    days = int(total_hours / 24)
    days_part = f'{days}d ' if days else ''
    hours_part = f'{hours}h ' if hours else ''
    return f'{days_part}{hours_part}{minutes}m'


register = template.Library()
register.filter("secs2hm", secs2hm)
register.filter("time_interval", time_interval)
