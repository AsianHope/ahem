# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('restless', '0002_auto_20150309_0224'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='c',
            field=models.CharField(max_length=2, null=True, verbose_name=b'Nationality'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='departmentNumber',
            field=models.CharField(max_length=8, null=True, verbose_name=b'Department', choices=[(b'LIS', b'Logos International School')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='displayName',
            field=models.CharField(max_length=32, null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='employeeType',
            field=models.CharField(max_length=2, null=True, choices=[(b'PT', b'Part Time'), (b'FT', b'Full Time')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='employee',
            name='gecos',
            field=models.CharField(max_length=32, null=True, verbose_name=b'Full Name'),
            preserve_default=True,
        ),
    ]
