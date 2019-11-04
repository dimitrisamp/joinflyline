def user_processor(request):
    user = request.user
    return {
        'django_user': {
            'anonymous': user.is_anonymous,
        }
    }
