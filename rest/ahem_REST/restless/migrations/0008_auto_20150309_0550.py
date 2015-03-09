# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('restless', '0007_auto_20150309_0550'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='givenNamekh',
            field=models.CharField(max_length=32, null=True, verbose_name=b'Given Name in Khmer'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='employee',
            name='created',
            field=models.DateField(default=datetime.datetime(2015, 3, 9, 5, 50, 38, 996838), auto_now_add=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='employee',
            name='modified',
            field=models.DateField(default=datetime.datetime(2015, 3, 9, 5, 50, 38, 996877), auto_now_add=True),
            preserve_default=True,
        ),
    ]
