from django.urls import path

import apps.info.views as V

urlpatterns = [
    path("about", V.about_view, name="about"),
    path("feedback", V.feedback_view, name="feedback"),
    path("team", V.team_view, name="team"),
    path("how-it-works", V.how_it_works_view, name="how-it-works"),
    path(
        "corporate-how-it-works",
        V.corporate_how_it_works_view,
        name="corporate-how-it-works",
    ),
    path("destinations", V.destinations_view, name="destinations"),
]
