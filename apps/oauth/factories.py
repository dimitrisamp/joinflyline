import factory
from django.contrib.auth import get_user_model
from django.utils.timezone import now


class UserFactory(factory.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    email = factory.LazyAttribute(lambda a: f'{a.first_name}.{a.last_name}@example.com')
    username = factory.LazyAttribute(lambda a: a.email)
    password = 'secret'
    is_superuser = False
    is_staff = False
    is_active = True
    date_joined = factory.LazyFunction(now)

    
