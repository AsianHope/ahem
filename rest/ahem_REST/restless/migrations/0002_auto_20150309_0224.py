# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('restless', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='sn',
            field=models.CharField(max_length=32, null=True, verbose_name=b'Surname'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='snkh',
            field=models.CharField(max_length=32, null=True, verbose_name=b'Surname in Khmer'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='uid',
            field=models.CharField(max_length=32, null=True, verbose_name=b'username'),
            preserve_default=True,
        ),
    ]
