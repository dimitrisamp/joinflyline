from django.db import models


class PromoInfo(models.Model):
    dt_entered = models.DateTimeField(auto_now_add=True)
    email = models.EmailField(null=True, blank=True)
    instagram = models.CharField(max_length=256, null=True, blank=True)
