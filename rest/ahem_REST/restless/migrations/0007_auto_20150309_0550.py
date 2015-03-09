# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('restless', '0006_auto_20150309_0339'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='givenName',
            field=models.CharField(max_length=32, null=True, verbose_name=b'Given Name'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='jpegPhoto',
            field=models.URLField(null=True, verbose_name=b'Link to Image'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='employee',
            name='created',
            field=models.DateField(default=datetime.datetime(2015, 3, 9, 5, 50, 0, 459021), auto_now_add=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='employee',
            name='modified',
            field=models.DateField(default=datetime.datetime(2015, 3, 9, 5, 50, 0, 459051), auto_now_add=True),
            preserve_default=True,
        ),
    ]
