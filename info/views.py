from django.shortcuts import render


def news_view(request):
    context = {
        'title': 'Wanderift news'
    }
    render(request, 'news.html', context)


def about_view(request):
    context = {
        'title': 'About us'
    }
    render(request, 'about.html', context)


def feedback_view(request):
    context = {
        'title': 'Feedback'
    }
    render(request, 'feedback.html', context)


def team_view(request):
    context = {
        'title': 'Wanderift Team'
    }
    render(request, 'team.html', context)


def partners_view(request):
    context = {
        'title': 'Wanderift Partners'
    }
    render(request, 'partners.html', context)
