from django import template
from django.utils import dateparse

register = template.Library()


@register.filter(name='time_interval')
def time_interval(value):
    x = dateparse.parse_datetime(value['local_departure'])
    y = dateparse.parse_datetime(value['local_arrival'])
    return y-x
