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
        from_email = "booking@wanderift.com"
        to_email = booking_contact["email"]
        text_content = Content("text/html", htm_content)
        subject = "Booking Successful"
        try:
            send_mail(subject, "text body", from_email,
                      [to_email], html_message=text_content)
        except Exception as e:
            print(e)
        return render(
            request,
            "emails/booking_success.html",
            context={"data": booking, "i": 0, "booking_contact": booking_contact},
        )
    else:
        return HttpResponse(status=500)
