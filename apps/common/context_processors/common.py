from django.conf import settings


def get_user_info(user):
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
    return django_user

def common_processor(request):
    user = request.user
    return {
        "django_user": get_user_info(user),
        "SENTRY_DSN": settings.SENTRY_DSN,
        "stage": settings.STAGE,
    }
