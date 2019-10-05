import json

from django.contrib.auth.models import User
from django.db import models
from django.db.transaction import atomic

from wanderift.utils import parse_isodatetime


class BookingContact(models.Model):
    booking_id = models.CharField(max_length=20, db_index=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    data = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.booking_id} <-> {self.email} {self.phone}"

    def to_data(self):
        obj = json.loads(self.data)
        obj["flights"] = [
            flight.to_data() for flight in self.flights.order_by("departure_time")
        ]
        obj["booking_id"] = self.booking_id
        return obj

    @classmethod
    def from_data(cls, booking_data, user, email, phone):
        with atomic():
            bd = booking_data.copy()
            flights = bd.pop("flights")
            booking_id = bd.pop("booking_id")
            booking = BookingContact.objects.create(
                data=json.dumps(bd),
                email=email,
                phone=phone,
                user=user,
                booking_id=booking_id,
            )
            for fd in flights:
                data = {
                    "booking": booking,
                    "departure_time": parse_isodatetime(fd.pop("utc_departure")),
                    "arrival_time": parse_isodatetime(fd.pop("utc_arrival")),
                    "city_from": fd.pop("src_name"),
                    "city_to": fd.pop("dst_name"),
                    "airport_from": fd.pop("src"),
                    "airport_to": fd.pop("dst"),
                    "is_return": bool(fd.pop("return")),
                }
                data["data"] = json.dumps(fd)
                Flight.objects.create(**data)
            return booking


class Flight(models.Model):
    booking = models.ForeignKey(
        BookingContact, on_delete=models.CASCADE, related_name="flights"
    )
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    city_from = models.CharField(max_length=50)
    city_to = models.CharField(max_length=50)
    airport_from = models.CharField(max_length=3)
    airport_to = models.CharField(max_length=3)
    is_return = models.BooleanField(default=False)
    data = models.TextField()

    def __str__(self):
        return f"{self.city_from} -> {self.city_to}"

    def to_data(self):
        data = json.loads(self.data)
        data["utc_departure"] = self.departure_time.isoformat()
        data["utc_arrival"] = self.arrival_time.isoformat()
        data["src_name"] = self.city_from
        data["dst_name"] = self.city_to
        data["src"] = self.airport_from
        data["dst"] = self.airport_to
        data["return"] = 1 if self.is_return else 0
        return data
