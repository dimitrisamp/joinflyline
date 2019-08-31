from django.shortcuts import render


def team_view(request, *args, **kwargs):
    context = {
        "title": "Team",
    }
    return render(request, "team.html", context)
