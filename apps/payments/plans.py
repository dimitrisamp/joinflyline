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


plan_groups = (
    ("3-6 Round Trips", False, ("three-pack", "six-pack")),
    ("12 Round Trips", True, "lite"),
    ("18 Round Trips", True, "pro"),
    ("24 Round Trips", True, "biz"),
)

GROUP_TO_PLAN = {
    k: v for k, *v in plan_groups
}

def _plan2group():
    result = {}
    for group_name, annual, p in plan_groups:
        if annual:
            result[p] = group_name
        else:
            for plan_code in p:
                result[plan_code] = group_name
    return result


plan2group = _plan2group()


def plan_calc(plan):
    result = plan.copy()
    if plan['annual']:
        result['price_annual'] = result['price_mo_annual'] * 12
        result['savings'] = result['price_mo']*12 - result['price_annual']
    result['credits_per_month'] = f"{result['credits'] / 12:.1f}".rstrip('0').rstrip('.')
    result['flight_num_per_month'] = f"{result['credits'] / 24:.1f}".rstrip('0').rstrip('.')
    result['flight_num'] = result['credits'] // 2
    return result


def get_available_plans():
    result = {}
    for k, v in PLANS.items():
        r = plan_calc(v)
        r['code'] = k
        result[k] = r
    return result


