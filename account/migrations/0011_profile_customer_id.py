# Generated by Django 2.2.4 on 2019-09-09 20:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0010_account_token'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='customer_id',
            field=models.CharField(blank=True, max_length=70),
        ),
    ]