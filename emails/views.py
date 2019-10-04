from django.http import HttpResponse
from django.shortcuts import render
from django.template.loader import render_to_string
from sendgrid import Content, sendgrid
from sendgrid.helpers.mail import Mail

from booking.models import BookingContact

SEND_GRID_API_KEY = "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"


def booking_success(request, booking_id, booking_response):
    booking_contact = BookingContact.objects.filter(booking_id=booking_id)

    if booking_contact:

        htm_content = render_to_string('booking_success.html',
                                                      {'data': booking_response, "i": 0,
                                                       "booking_contact": booking_contact})

        sg = sendgrid.SendGridAPIClient(SEND_GRID_API_KEY)
        from_email = "booking@wanderift.com"
        to_email = booking_contact["email"]
        text_content = Content("text/html", htm_content)
        subject = "Booking Successful"
        mail = Mail(from_email, to_email, subject)
        mail.add_content(text_content)
        try:
            sg.send(mail)
        except Exception as e:
            print(e)
        return render(request, "booking_success.html",
                      context={'data': booking_response, "i": 0, "booking_contact": booking_contact})
    else:
        return HttpResponse(status=500)
