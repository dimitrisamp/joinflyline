from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created

from apps.account.models import DealWatch
from apps.emails.views import forgot_password


@receiver(post_delete, sender=DealWatch, dispatch_uid='deal_watch_post_delete')
def deal_watch_post_delete(sender, instance: DealWatch, **kwargs):
    if instance.group and instance.group.must_die():
        instance.group.delete()


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    forgot_password(reset_password_token.user.id, reset_password_token.key)

