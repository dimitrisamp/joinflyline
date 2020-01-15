from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string

from apps.account.enums import CompanionInviteStatus
from apps.account.models import CompanionInvite
from apps.auth.models import User


@shared_task
def adding_task(x, y):
    return x + y


@shared_task
def invite_companion(invite_id):
    invite = CompanionInvite.objects.get(pk=invite_id)
    if invite:
        htm_content = render_to_string(
            "emails/invite.html",
            {"code": invite.invite_code, 'SITE_URL': settings.SITE_URL},
        )
        from_email = settings.SERVER_EMAIL
        to_email = invite.email
        subject = "You are invited"
        send_mail(subject, "text body", from_email,
                  [to_email], html_message=htm_content)
        invite.status = CompanionInviteStatus.email_sent
        invite.save()


@shared_task
def send_activation_email(user_id):
    user = User.objects.get(pk=user_id)
    if user.activation_code:
        htm_content = render_to_string(
            "emails/invite.html",
            {"code": user.activation_code, 'SITE_URL': settings.SITE_URL},
        )
        from_email = settings.SERVER_EMAIL
        to_email = user.email
        subject = "You are invited"
        send_mail(subject, "text body", from_email,
                  [to_email], html_message=htm_content)


@shared_task
def send_deal_alerts_activation_email(user_id):
    user = User.objects.get(pk=user_id)
    if user.activation_code:
        htm_content = render_to_string(
            "emails/invite.html",
            {"code": user.activation_code, 'SITE_URL': settings.SITE_URL},
        )
        from_email = settings.SERVER_EMAIL
        to_email = user.email
        subject = "You are invited"
        send_mail(subject, "text body", from_email,
                  [to_email], html_message=htm_content)
