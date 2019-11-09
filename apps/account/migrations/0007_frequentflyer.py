# Generated by Django 2.2.7 on 2019-11-08 19:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('account', '0006_auto_20191106_1027'),
    ]

    operations = [
        migrations.CreateModel(
            name='FrequentFlyer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('american_airlines', models.CharField(blank=True, max_length=30)),
                ('united_airlines', models.CharField(blank=True, max_length=30)),
                ('southwest_airlines', models.CharField(blank=True, max_length=30)),
                ('sun_country_airlines', models.CharField(blank=True, max_length=30)),
                ('frontier_airlines', models.CharField(blank=True, max_length=30)),
                ('delta_airlines', models.CharField(blank=True, max_length=30)),
                ('alaska_airlines', models.CharField(blank=True, max_length=30)),
                ('jetBlue', models.CharField(blank=True, max_length=30)),
                ('spirit_airlines', models.CharField(blank=True, max_length=30)),
                ('allegiant_air', models.CharField(blank=True, max_length=30)),
                ('hawaiian_airlines', models.CharField(blank=True, max_length=30)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]