# Generated by Django 2.2.4 on 2019-10-02 08:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='plans',
            name='name',
            field=models.CharField(blank=True, max_length=20),
        ),
    ]
