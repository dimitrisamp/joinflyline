def user_processor(request):
    user = request.user
    return {
        'django_user': {
            'anonymous': user.is_anonymous,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'username': user.username,
        }
    }
