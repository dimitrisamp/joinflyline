from django.shortcuts import render


def feedback_view(request, *args, **kwargs):
    context = {
        "title": "Feedback",
    }
    return render(request, "feedback.html", context)
