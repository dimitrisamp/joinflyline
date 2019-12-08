from django.contrib.postgres.fields import ArrayField, JSONField
from django.contrib.postgres.indexes import BTreeIndex
from django.db import models
from django.db.transaction import atomic

from apps.auth.models import User
from wanderift.utils import parse_isodatetime


class BookingContact(models.Model):
    booking_id = models.CharField(max_length=20, db_index=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    data = JSONField(null=True, blank=True)
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.booking_id} <-> {self.email} {self.phone}"

    def is_domestic(self):
        return all(f.is_domestic() for f in self.flights.all())

    @classmethod
    def from_data(cls, booking_data, user, email, phone, retail_info):
        retail_info = retail_info.copy()
        route_information = retail_info.pop("route")
        retail_info.pop("parent")
        retail_flights = {o["id"]: o for o in route_information}
        bd = booking_data.copy()
        flights = bd.pop("flights")
        booking_id = bd.pop("booking_id")
        with atomic():
            booking = BookingContact.objects.create(
                data={**retail_info, **bd},
                email=email,
                phone=phone,
                user=user,
                booking_id=booking_id,
            )
            for fd in flights:
                flight_id = fd.pop("id")
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
                data["data"] = {**retail_flights[flight_id], **fd}
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
    data = JSONField()

    def __str__(self):
        return f"{self.city_from} -> {self.city_to}"

    def is_domestic(self):
        return self.data["src_country"] == "US" and self.data["dst_country"] == "US"

    def to_data(self):
        data = self.data
        data["utc_departure"] = self.departure_time
        data["utc_arrival"] = self.arrival_time
        data["src_name"] = self.city_from
        data["dst_name"] = self.city_to
        data["src"] = self.airport_from
        data["dst"] = self.airport_to
        data["return"] = 1 if self.is_return else 0
        return data


class Deal(models.Model):
    city_from = models.CharField(max_length=50)
    city_to = models.CharField(max_length=50)
    city_from_name = models.CharField(max_length=50)
    city_to_name = models.CharField(max_length=50)
    fly_from = models.CharField(max_length=50)
    fly_to = models.CharField(max_length=50)
    dt_departure = models.DateTimeField()
    dt_return = models.DateTimeField()
    departure_date = models.DateField()
    departure_time = models.TimeField()
    return_date = models.DateField()
    return_time = models.TimeField()
    airlines = ArrayField(models.CharField(max_length=50))
    price = models.DecimalField(max_digits=10, decimal_places=2)
    trip_id = models.TextField()
    updated = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"{self.city_from}({self.fly_from}) -> {self.city_to}({self.fly_to}) "
            f"${self.price} {self.updated.isoformat()}"
        )

    class Meta:
        indexes = (
            BTreeIndex(fields=("city_from", "city_to")),
            BTreeIndex(fields=("fly_from", "fly_to")),
        )


DESTINATION_TYPE_CHOICES = (("round", "Round Trip"), ("oneway", "Oneway"))


class SearchHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    place_from = JSONField()
    place_to = JSONField()
    departure_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    adults = models.IntegerField(default=0)
    children = models.IntegerField(default=0)
    infants = models.IntegerField(default=0)
    seat_type = models.CharField(max_length=10)
    destination_type = models.CharField(max_length=10, choices=DESTINATION_TYPE_CHOICES)

    class Meta:
        indexes = (
            BTreeIndex(fields=('timestamp', )),
        )
