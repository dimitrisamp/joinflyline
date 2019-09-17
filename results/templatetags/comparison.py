from django import template
from django.template.defaultfilters import register
from django.utils import dateparse

register = template.Library()


@register.filter(name='comparison')
def comparison(flight):
    price = flight['price']
    if len(flight['routes']) == 1:
        if price > 185 and price < 230:
            return (price-185)
        elif price > 230:
            return (price-230)
    elif len(flight['routes']) > 1:
        if price > 369 and price < 459:
            return (price-369)
        elif price > 459:
            return (price-459)