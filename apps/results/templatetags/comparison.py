from django import template


ROUND_TRIP_SUBSCRIBER_COST = 237
SINGLE_FLIGHT_SUBSCRIBER_COST = 118


def comparison(flight):
    price = flight["price"]
    if len(flight["routes"]) == 1:
        if price > SINGLE_FLIGHT_SUBSCRIBER_COST:
            return price - SINGLE_FLIGHT_SUBSCRIBER_COST
    elif len(flight["routes"]) > 1:
        if price > ROUND_TRIP_SUBSCRIBER_COST:
            return price - ROUND_TRIP_SUBSCRIBER_COST


register = template.Library()
register.filter("comparison", comparison)
