from django import template

register = template.Library()

AIRLINE_NAMES = {
    "DL": "Delta",
    "AS": "Alaska",
    "NK": "Spirit",
    "B6": "JetBlue",
    "F9": "Frontier",
    "G4": "Allegiant",
    "UA": "United",
    "AA": "American",
    "WN": "Southwest",
    "SY": "Sun Country",
}


@register.filter(name="airlines")
def airlines(value):
    return AIRLINE_NAMES.get(value)
