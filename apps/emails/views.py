from django.http import HttpResponse
from django.shortcuts import render
from django.template.loader import render_to_string

from apps.booking.models import BookingContact
from django.core.mail import send_mail


def booking_success(request, booking):
    booking_contact = BookingContact.objects.filter(booking_id=booking["booking_id"])

    if booking_contact:
        htm_content = render_to_string(
            "emails/booking_success.html",
            {"data": booking, "i": 0, "booking_contact": booking_contact},
        )
        from_email = "booking@joinflyline.com"
        to_email = booking_contact["email"]
        subject = "Booking Successful"
        send_mail(subject, "text body", from_email,
                  [to_email], html_message=htm_content)


def signup_success(request, user):
    if user:
        htm_content = render_to_string(
            "emails/add-traveler-information.html",
            {"data": user},
        )
        from_email = "noreply@joinflyline.com"
        to_email = user.email
        subject = "SignUp Successful"
        send_mail(subject, "text body", from_email,
                  [to_email], html_message=htm_content)


def finish_setting_up_account(request, user):
    if user:
        htm_content = render_to_string(
            "emails/finish-setting-up-account.html",
            {"data": user},
        )
        from_email = "noreply@joinflyline.com"
        to_email = user.email
        subject = "Finish Setting Up Account"
        send_mail(subject, "text body", from_email, [to_email], html_message=htm_content)


def forgot_password(request, user):
    if user:
        htm_content = render_to_string(
            "emails/forgot-password.html",
            {"data": user},
        )
        from_email = "noreply@joinflyline.com"
        to_email = user.email
        subject = "Forgot Password"
        send_mail(subject, "text body", from_email, [to_email], html_message=htm_content)


def search_discount_flights(request, user):
    if user:
        htm_content = render_to_string(
            "emails/search-discount-flights.html",
            {"data": user},
        )
        from_email = "noreply@joinflyline.com"
        to_email = user.email
        subject = "Search Discount Flights"
        send_mail(subject, "text body", from_email, [to_email], html_message=htm_content)

