from django.shortcuts import render


def news_view(request):
    context = {
        'title': 'Wanderift news'
    }
    return render(request, 'info/news.html', context)


def about_view(request):
    context = {
        'title': 'About us'
    }
    return render(request, 'info/about.html', context)


def feedback_view(request):
    context = {
        'title': 'Feedback'
    }
    return render(request, 'info/feedback.html', context)


def team_view(request):
    context = {
        'title': 'Wanderift Team'
    }
    return render(request, 'info/team.html', context)


def partners_view(request):
    context = {
        'title': 'Wanderift Partners'
    }
    return render(request, 'info/partners.html', context)


def how_it_works_view(request):
    context = {
        'title': 'How it Works',
        'promo_button_text': "Start Saving"
    }
    return render(request, 'info/personal-how-it-works.html', context)


def corporate_how_it_works_view(request):
    context = {
        'title': 'Corporate How it Works'
    }
    return render(request, 'corporate/how-it-works.html', context)


def faq_view(request):
    context = {
        "title": "Wanderift faq"
    }
    return render(request, "info/faq.html", context)


def destinations_view(request):
    context = {
        "title": "Destinations"
    }
    return render(request, "info/destinations.html", context)


def plans_view(request):
    context = {
        "title": "Plans"
    }
    return render(request, "info/plans.html", context)
