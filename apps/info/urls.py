from django.urls import path

import apps.info.views as V

urlpatterns = [
    path("news", V.news_view, name="news"),
    path("about", V.about_view, name="about"),
    path("feedback", V.feedback_view, name="feedback"),
    path("team", V.team_view, name="team"),
    path("partners", V.partners_view, name="partners"),
    path("how-it-works", V.how_it_works_view, name="how-it-works"),
    path(
        "corporate-how-it-works",
        V.corporate_how_it_works_view,
        name="corporate-how-it-works",
    ),
    path("faq", V.faq_view, name="faq"),
    path("plans", V.plans_view, name="plans"),
    path("destinations", V.destinations_view, name="destinations"),
]
