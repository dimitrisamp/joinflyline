from django import template
from django.contrib.staticfiles.templatetags.staticfiles import static

register = template.Library()


AIRLINE_ICONS = {
    "DL": "delta",
    "AS": "alaska",
    "NK": "spirit",
    "B6": "jetblue",
    "F9": "frontier",
    "G4": "allegiant",
    "UA": "united",
    "AA": "american",
    "WN": "southwest",
    "SY": "suncountry",
    "4O": 'interjet',
    "AC": 'air canada',
    "AF": 'Air France',
    "AM": 'Aeroméxico',
    "DI": 'Norwegian Air UK',
    "EK": 'Emirates Airlines',
    "F8": 'Flair Airlines',
    "HU": 'Hainan Airlines',
    "KL": 'KLM',
    "LH": 'Lufthansa',
    "LX": 'Swiss International Air Lines',
    "TS": 'Air Transat',
    "WS": 'WestJet',
}


@register.filter(name="aircon")
def aircon(value):
    if isinstance(value, dict):
        value = value['code']
    return static(f'images/airlines/{value}.png')
