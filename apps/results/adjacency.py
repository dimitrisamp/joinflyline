ADJACENCY = {
    "Austin": (
        "Dallas",
        "New York",
        "San Francisco",
        "Seattle",
        "Salt Lake City",
        "Denver",
        "Los Angeles",
        "Orlando",
        "Miami",
        "Atlanta",
        "Las Vegas",
        "Chicago",
    ),
    "Dallas": (
        "Austin",
        "New York",
        "San Francisco",
        "Seattle",
        "Salt Lake City",
        "Denver",
        "Los Angeles",
        "Orlando",
        "Miami",
        "Atlanta",
        "Charlotte",
        "Boston",
        "Las Vegas",
        "Chicago",
    ),
    "Los Angeles": (
        "Las Vegas",
        "Los Angeles",
        "New York",
        "San Francisco",
        "Salt Lake City",
        "Denver",
        "Atlanta",
        "Charlotte",
        "Orlando",
        "Seattle",
        "Denver",
        "Austin",
        "Dallas",
        "Chicago",
    ),
    "San Francisco": (
        "Las Vegas",
        "Los Angeles",
        "New York",
        "Salt Lake City",
        "Denver",
        "Atlanta",
        "Charlotte",
        "Orlando",
        "Seattle",
        "Denver",
        "Austin",
        "Dallas",
        "Chicago",
    ),
    "Seattle": (
        "Dallas",
        "New York",
        "San Francisco",
        "Salt Lake City",
        "Denver",
        "Los Angeles",
        "Orlando",
        "Miami",
        "Atlanta",
        "Las Vegas",
        "Chicago",
    ),
    "New York": (
        "Las Vegas",
        "Los Angeles",
        "San Francisco",
        "Salt Lake City",
        "Denver",
        "Atlanta",
        "Charlotte",
        "Orlando",
        "Denver",
        "Dallas",
        "Chicago",
        "Miami",
        "Detroit",
        "Baltimore",
        "Boston",
        "Charlotte",
        "Philadelphia",
    ),
    "Atlanta": (
        "Las Vegas",
        "Los Angeles",
        "San Francisco",
        "Salt Lake City",
        "Denver",
        "Charlotte",
        "Orlando",
        "Denver",
        "Dallas",
        "Chicago",
        "Miami",
        "Detroit",
        "Baltimore",
        "Boston",
        "Charlotte",
        "Philadelphia",
    ),
    "Charlotte": (
        "Las Vegas",
        "Los Angeles",
        "San Francisco",
        "Salt Lake City",
        "Denver",
        "Atlanta",
        "Orlando",
        "Denver",
        "Dallas",
        "Chicago",
        "Miami",
        "Detroit",
        "Baltimore",
        "Boston",
        "Charlotte",
        "Philadelphia",
    ),
    "Denver": (
        "Las Vegas",
        "New York",
        "Seattle",
        "Austin",
        "Dallas",
        "San Francisco",
        "Austin",
        "Los Angeles",
        "Atlanta",
        "Boston",
        "Chicago",
    ),
}

LOWER_KEYS = {k.lower(): k for k in ADJACENCY.keys()}

IATA_CODES = {
    "Las Vegas",
    "Orlando",
    "Miami",
    "Baltimore",
    "Salt Lake City",
    "Charlotte",
    "Philadelphia",
    "Seattle",
    "Boston",
    "Denver",
    "San Francisco",
    "Dallas",
    "Los Angeles",
    "Austin",
    "Detroit",
    "Chicago",
    "New York",
    "Atlanta",
}

CITY_STATE_COUNTRY_AIRPORT = [
    ["Atlanta", "Georgia", "US", "ATL"],
    ["Atlanta", "Georgia", "US", "PDK"],
    ["Austin", "Texas", "US", "AUS"],
    ["Baltimore", "Maryland", "US", "BWI"],
    ["Boston", "Massachusetts", "US", "BOS"],
    ["Charlotte", "North-Carolina", "US", "CLT"],
    ["Chicago", "Illinois", "US", "MDW"],
    ["Chicago", "Illinois", "US", "ORD"],
    ["Dallas", "Texas", "US", "ADS"],
    ["Dallas", "Texas", "US", "DAL"],
    ["Denver", "Colorado", "US", "APA"],
    ["Denver", "Colorado", "US", "BJC"],
    ["Denver", "Colorado", "US", "DEN"],
    ["Detroit", "Michigan", "US", "DET"],
    ["Detroit", "Michigan", "US", "DTW"],
    ["Detroit", "Michigan", "US", "YIP"],
    ["Las Vegas", "Nevada", "US", "LAS"],
    ["Los Angeles", "California", "US", "LAX"],
    ["Miami", "Florida", "US", "MIA"],
    ["New York", "New-York", "US", "JFK"],
    ["New York", "New-York", "US", "LGA"],
    ["Orlando", "Florida", "US", "MCO"],
    ["Orlando", "Florida", "US", "SFB"],
    ["Philadelphia", "Florida", "US", "BBX"],
    ["Philadelphia", "Pennsylvania", "US", "PHL"],
    ["Salt Lake City", "Utah", "US", "SLC"],
    ["San Francisco", "California", "US", "SFO"],
    ["Seattle", "Washington", "US", "BFI"],
    ["Seattle", "Washington", "US", "SEA"],
]

CITY_DATA = {}
for city, state, country, code in CITY_STATE_COUNTRY_AIRPORT:
    CITY_DATA.setdefault(city, []).append([state, country, code])

AIRPORT_TO_CITY = {
    code: city for city, _, _, code in CITY_STATE_COUNTRY_AIRPORT
}

def wrap_city_data(cities):
    result = []
    for city in cities:
        data = CITY_DATA[city]
        for state, country, code in data:
            result.append(
                {
                    "name": city,
                    "subdivision": {"name": state},
                    "country": {"code": country},
                    "code": code,
                }
            )
    return result


def get_city_from(term):
    if term == '__all__':
        return list(sorted(v for k, v in LOWER_KEYS.items()))
    else:
        return list(sorted(v for k, v in LOWER_KEYS.items() if term.lower() in k))


def get_city_to(city_from, term=None):
    try:
        cities = ADJACENCY[LOWER_KEYS[city_from.lower()]]
    except KeyError:
        return []
    lower_cities = {c.lower(): c for c in cities}
    if term:
        return list(sorted(v for k, v in lower_cities.items() if term.lower() in k))
    else:
        return list(sorted(v for k, v in lower_cities.items()))
