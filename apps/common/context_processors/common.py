from django.conf import settings

def common_processor(request):
    user = request.user
    django_user = {"anonymous": user.is_anonymous}
    if not user.is_anonymous:
        django_user.update(
            {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "username": user.username,
            }
        )
        if user.profile:
            django_user["market"] = user.profile.market
    return {
        "django_user": django_user,
        "SENTRY_DSN": settings.SENTRY_DSN,
        "stage": settings.STAGE,
    }
