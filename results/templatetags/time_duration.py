from django import template
from django.utils import dateparse


def time_interval(value):
    x = dateparse.parse_datetime(value['utc_departure'])
    y = dateparse.parse_datetime(value['utc_arrival'])
    z = y-x
    return secs2hm(z.seconds)


def secs2hm(value):
    hours = int(value / 3600)
    minutes = int(value / 60 - (hours * 60))
    return str(hours) + "h " + str(minutes) + "m"


register = template.Library()
register.filter("secs2hm", secs2hm)
register.filter("time_interval", time_interval)
