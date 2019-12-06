from apps.account.models import DealWatchGroup
from apps.account.tests.factories import DealWatchFactory
from apps.oauth.factories import UserFactory


def test_dealwatchgroup_is_created(db):
    user = UserFactory()
    dw = DealWatchFactory(user=user, airlines=['XX', 'AA', 'KK'])
    assert dw.group
    assert set(dw.group.airline_list()) == set(dw.airlines)


def test_dealwatchgroup_is_created_no_airlines(db):
    user = UserFactory()
    dw = DealWatchFactory(user=user, airlines=[])
    assert dw.group
    print(f'dwa={dw.group.airlines}')
    assert set(dw.group.airline_list()) == set(dw.airlines)


def test_dealwatchgroup_deleted(db):
    user = UserFactory()
    dw = DealWatchFactory(user=user, airlines=[])
    dw2 = DealWatchFactory(user=user, airlines=[], max_price=100, destination=dw.destination)
    group_pk = dw.group.pk
    dw.delete()
    assert DealWatchGroup.objects.filter(pk=group_pk).exists()
    dw2.delete()
    assert not DealWatchGroup.objects.filter(pk=group_pk).exists()
