from django.contrib.auth.models import User
from django.db import models


class SearchDetails(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True, default=None
    )
    fly_from = models.CharField(max_length=20)
    fly_to = models.CharField(max_length=20)
    date_from = models.CharField(max_length=20)
    date_to = models.CharField(max_length=20)
    return_from = models.CharField(max_length=20)
    return_to = models.CharField(max_length=20)
    flight_type = models.CharField(max_length=20)
    adults = models.CharField(max_length=20)
    children = models.CharField(max_length=20)
    infants = models.CharField(max_length=20)
    max_stopovers = models.IntegerField(null=True, blank=True)
    stopover_from = models.CharField(max_length=20, null=True, blank=True)
    stopover_to = models.CharField(max_length=20, null=True, blank=True)
    selected_cabins = models.CharField(max_length=20, default='M')

    def __str__(self):
        return SearchDetails.fly_from


class BookingCache(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    booking_token = models.TextField(db_index=True)
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    search_result = models.ForeignKey(
        SearchDetails, on_delete=models.CASCADE, blank=True, null=True
    )
    data = models.TextField()

    def __str__(self):
        return self.booking_token
