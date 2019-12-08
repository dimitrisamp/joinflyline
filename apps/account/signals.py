from django.db.models.signals import post_delete
from django.dispatch import receiver

from apps.account.models import DealWatch


@receiver(post_delete, sender=DealWatch, dispatch_uid='deal_watch_post_delete')
def deal_watch_post_delete(sender, instance, **kwargs):
    if instance.group and not instance.group.watches.exists():
        instance.group.delete()
