from django.template.loader import render_to_string

from apps.auth.models import User
from apps.booking.models import BookingContact
from django.core.mail import send_mail
from django.conf import settings


def booking_success(booking):
    booking_contact = BookingContact.objects.filter(booking_id=booking["booking_id"]).first()

    if booking_contact:
        htm_content = render_to_string(
            "emails/booking_success.html",
            {"data": booking, "i": 0, "booking_contact": booking_contact},
        )
        from_email = "booking@sb.joinflyline.com"
        to_email = booking_contact.email
        subject = "Booking Successful"
        send_mail(subject, "text body", from_email,
                  [to_email], html_message=htm_content)


def signup_success(user_id):
    user = User.objects.get(pk=user_id)
    htm_content = render_to_string(
        "emails/add-traveler-information.html",
        {"data": user, 'SITE_URL': settings.SITE_URL},
    )
    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = user.email
    subject = "Welcome to FlyLine"
    send_mail(subject, "text body", from_email,
              [to_email], html_message=htm_content)


def finish_setting_up_account(request, user):
    if user:
        htm_content = render_to_string(
            "emails/finish-setting-up-account.html",
            {"data": user},
        )
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = user.email
        subject = "Finish Setting Up Account"
        send_mail(subject, "text body", from_email, [to_email], html_message=htm_content)


def forgot_password(user_id, secret):
    user = User.objects.get(pk=user_id)
    htm_content = render_to_string(
        "emails/forgot-password.html",
        {
            "user": user,
            "secret": secret
        },
    )
    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = user.email
    subject = "Forgot Password"
    send_mail(subject, "text body", from_email, [to_email], html_message=htm_content)


def search_discount_flights(request, user):
    if user:
        htm_content = render_to_string(
            "emails/search-discount-flights.html",
            {"data": user},
        )
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = user.email
        subject = "Search Discount Flights"
        send_mail(subject, "text body", from_email, [to_email], html_message=htm_content)

