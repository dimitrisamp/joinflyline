# Generated by Django 2.2.4 on 2019-09-09 19:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0009_auto_20190909_1947'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='token',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
