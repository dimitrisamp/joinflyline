from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string

from apps.account.models import CompanionInvite


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
