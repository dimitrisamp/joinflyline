# Generated by Django 2.2.8 on 2019-12-08 04:42

import django.contrib.postgres.indexes
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('booking', '0001_initial'),
        ('oauth', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='searchhistory',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='oauth.User'),
        ),
        migrations.AddField(
            model_name='flight',
            name='booking',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='flights', to='booking.BookingContact'),
        ),
        migrations.AddIndex(
            model_name='deal',
            index=django.contrib.postgres.indexes.BTreeIndex(fields=['city_from', 'city_to'], name='booking_dea_city_fr_9f9bdb_btree'),
        ),
        migrations.AddIndex(
            model_name='deal',
            index=django.contrib.postgres.indexes.BTreeIndex(fields=['fly_from', 'fly_to'], name='booking_dea_fly_fro_aaafa6_btree'),
        ),
        migrations.AddField(
            model_name='bookingcontact',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='oauth.User'),
        ),
        migrations.AddIndex(
            model_name='searchhistory',
            index=django.contrib.postgres.indexes.BTreeIndex(fields=['timestamp'], name='booking_sea_timesta_0bf27c_btree'),
        ),
    ]
