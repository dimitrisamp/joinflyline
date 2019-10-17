PLANS = {
    'three-pack': {
        'name': '3 Pack of Flights',
        'credits': 6,
        'price': 879,
        'annual': False
    },
    'six-pack': {
        'name': '6 Pack of Flights',
        'credits': 12,
        'price': 1699,
        'annual': False
    },
    'lite': {
        'credits': 24,
        'name': 'Wanderift Lite',
        'price_mo': 279,
        'price_mo_annual': 269,
        'annual': True,
    },
    'pro': {
        'credits': 36,
        'name': 'Wanderift Pro',
        'price_mo': 389,
        'price_mo_annual': 359,
        'annual': True,
    },
    'biz': {
        'credits': 48,
        'name': 'Wanderift Biz',
        'price_mo': 479,
        'price_mo_annual': 449,
        'annual': True,
    },
}


def plan_calc(plan):
    result = plan.copy()
    if plan['annual']:
        result['price_annual'] = result['price_mo_annual'] * 12
        result['savings'] = result['price_mo']*12 - result['price_annual']
    result['flight_num'] = result['credits'] // 2
    return result


def get_available_plans():
    result = {}
    for k, v in PLANS.items():
        r = plan_calc(v)
        r['code'] = k
        result[k] = r
    return result
