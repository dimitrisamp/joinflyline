from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Account(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    card_number = models.CharField(max_length=30, blank=False)
    cvc = models.CharField(max_length=3, blank=False)
    expiry = models.CharField(max_length=10, blank=False)
    country = models.CharField(max_length=30, blank=True)
    zip = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.card_number, self.cvc, self.expiry, self.country, self.zip


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    market = models.CharField(max_length=30, blank=True)
    gender = models.CharField(max_length=10, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    dob = models.DateField(null=True, blank=True)
    stripe_id = models.CharField(max_length=50, blank=True)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
