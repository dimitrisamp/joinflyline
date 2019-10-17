from django.shortcuts import render

from apps.payments.plans import get_available_plans


def news_view(request):
    context = {"title": "Wanderift news"}
    return render(request, "info/news.html", context)


def about_view(request):
    context = {"title": "About us"}
    return render(request, "info/about.html", context)


def feedback_view(request):
    context = {"title": "Feedback"}
    return render(request, "info/feedback.html", context)


def team_view(request):
    context = {"title": "Wanderift Team"}
    return render(request, "info/team.html", context)


def partners_view(request):
    context = {"title": "Wanderift Partners"}
    return render(request, "info/partners.html", context)


plan_groups = (
    ("3-6 Round Trips", False, ("three-pack", "six-pack")),
    ("12 Round Trips", True, "lite"),
    ("18 Round Trips", True, "pro"),
    ("24 Round Trips", True, "biz"),
)


def how_it_works_view(request):
    available_plans = get_available_plans()
    plans = []
    for group_name, is_annual, p in plan_groups:
        if is_annual:
            plans.append([group_name, p, is_annual, available_plans[p]])
        else:
            plans.append(
                [
                    group_name,
                    "_".join(p),
                    is_annual,
                    [available_plans[pname] for pname in p],
                ]
            )
    context = {
        "title": "How it Works",
        "promo_button_text": "Start Saving",
        "plans": plans,
    }
    return render(request, "info/personal-how-it-works.html", context)


def corporate_how_it_works_view(request):
    context = {"title": "Corporate How it Works"}
    return render(request, "corporate/how-it-works.html", context)


def faq_view(request):
    context = {"title": "Wanderift faq"}
    return render(request, "info/faq.html", context)


def destinations_view(request):
    context = {"title": "Destinations"}
    return render(request, "info/destinations.html", context)


def plans_view(request):
    context = {"title": "Plans"}
    return render(request, "info/plans.html", context)
