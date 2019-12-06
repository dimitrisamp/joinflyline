from django.contrib.auth.models import User
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from apps.account.models import Profile, DealWatch


@receiver(post_save, sender=User, dispatch_uid='create_user_profile')
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)


@receiver(post_delete, sender=DealWatch, dispatch_uid='deal_watch_post_delete')
def deal_watch_post_delete(sender, instance, **kwargs):
    if instance.group and not instance.group.watches.exists():
        instance.group.delete()
