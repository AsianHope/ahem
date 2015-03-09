# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('restless', '0003_auto_20150309_0244'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='l',
            field=models.CharField(max_length=2, null=True, verbose_name=b'Work Country'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='mail',
            field=models.EmailField(max_length=75, null=True, verbose_name=b'Email Address'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='mailpr',
            field=models.EmailField(max_length=75, null=True, verbose_name=b'Personal Email Address'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='mobile',
            field=models.CharField(max_length=32, null=True, verbose_name=b'Phone Number'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='postalAddress',
            field=models.TextField(null=True, verbose_name=b'Present Address'),
            preserve_default=True,
        ),
    ]
