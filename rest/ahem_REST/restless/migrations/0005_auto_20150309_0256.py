# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('restless', '0004_auto_20150309_0246'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='children',
            field=models.IntegerField(null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='created',
            field=models.DateField(default=datetime.datetime(2015, 3, 9, 2, 56, 12, 964041), auto_now_add=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='degree',
            field=models.CharField(max_length=3, null=True, choices=[(b'PR', b'Primary School (or equivalent)'), (b'HS', b'High School (or equivalent)'), (b'BS', b'Bachelors'), (b'MS', b'Masters'), (b'PHD', b'PHD')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='enddate',
            field=models.DateField(null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='enteredCambodia',
            field=models.DateField(null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='faith',
            field=models.CharField(default=b'UD', max_length=2, choices=[(b'CR', b'Christian'), (b'BU', b'Buddhist'), (b'IS', b'Muslim'), (b'NF', b'No Faith'), (b'UD', b'Undeclared')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='gender',
            field=models.CharField(default=b'M', max_length=1, choices=[(b'M', b'Male'), (b'F', b'Female')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='maritialstatus',
            field=models.CharField(default=b'S', max_length=1, choices=[(b'S', b'Single'), (b'M', b'Married'), (b'D', b'Divorced')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='modified',
            field=models.DateField(default=datetime.datetime(2015, 3, 9, 2, 56, 12, 964096), auto_now_add=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='notes',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='nssf',
            field=models.IntegerField(null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='startdate',
            field=models.DateField(null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='title',
            field=models.CharField(max_length=32, null=True, verbose_name=b'Title'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='visaExpires',
            field=models.DateField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='document',
            name='required',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
    ]
