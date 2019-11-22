from rest_framework.routers import Route, SimpleRouter


class UserRouter(SimpleRouter):
    routes = [
        Route(
            url=r'^{prefix}{trailing_slash}$',
            mapping={'get': 'retrieve', 'patch': 'update'},
            name='{basename}',
            detail=True,
            initkwargs={'suffix': 'List'}
        ),
    ]
