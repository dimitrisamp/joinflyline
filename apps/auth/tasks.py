import csv
import pathlib
import shutil
import tempfile
from datetime import timedelta

from celery import shared_task
from django.core.mail import EmailMessage
from django.utils.timezone import now
from django.conf import settings

from . import models as M
from ..subscriptions.models import Subscriptions


@shared_task
def send_new_users():
    objects = M.User.objects.filter(date_joined__gte=now() - timedelta(days=1))
    temp_dir = pathlib.Path(tempfile.mkdtemp())
    reportname = temp_dir / "new_users.csv"
    with open(reportname, "w") as f:
        writer = csv.writer(f)
        writer.writerow(
            [
                "ID",
                "Last Login",
                "First name",
                "Last name",
                "Email",
                "Active",
                "Joined",
                "Title",
                "Market",
                "Gender",
                "Phone",
                "Birthdate",
                "TSA",
                "Country",
                "Zip",
                "Role",
                "Passport",
                "Source",
                "Plan",
                "Period"
            ]
        )
        for o in objects:
            sub: Subscriptions = o.subscription()
            writer.writerow(
                [
                    o.pk,
                    o.last_login.isoformat() if o.last_login else "",
                    o.first_name,
                    o.last_name,
                    o.email,
                    "yes" if o.is_active else "no",
                    o.date_joined.isoformat(),
                    o.title,
                    str(o.market),
                    o.gender.name if o.gender else "",
                    o.phone_number,
                    o.dob.isoformat() if o.dob else "",
                    o.tsa_precheck_number,
                    o.country_code,
                    o.zip,
                    o.role,
                    o.passport_number,
                    o.source,
                    sub.plan if sub else "",
                    str(sub.period) if sub else ""
                ]
            )
    email = EmailMessage(
        "New users report",
        "New users report",
        settings.DEFAULT_FROM_EMAIL,
        settings.REPORT_RECEIVERS,
        [],
    )
    email.attach_file(reportname)
    email.send()
    shutil.rmtree(temp_dir)
