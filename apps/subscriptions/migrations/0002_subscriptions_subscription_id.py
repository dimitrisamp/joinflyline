# Generated by Django 2.2.8 on 2019-12-22 07:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='subscriptions',
            name='subscription_id',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
    ]
