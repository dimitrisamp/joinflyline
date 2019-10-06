from django import template

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
}


@register.filter(name="aircon")
def aircon(value):
    return AIRLINE_ICONS.get(value)
