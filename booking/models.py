from django.contrib.auth.models import User
from django.db import models


class BookingContact(models.Model):
    booking_id = models.CharField(max_length=20, db_index=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.booking_id} <--> {self.email} {self.phone}"
