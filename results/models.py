from django.contrib.auth.models import User
from django.db import models


class SearchDetails(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, default=None)
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
    max_stopovers = models.IntegerField()
    stopover_from = models.CharField(max_length=20)
    stopover_to = models.CharField(max_length=20)

    def __str__(self):
        return SearchDetails.fly_from
