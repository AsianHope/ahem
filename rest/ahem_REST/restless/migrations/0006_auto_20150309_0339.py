# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('restless', '0005_auto_20150309_0256'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmployeeDocument',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('url', models.URLField()),
                ('updated', models.DateTimeField()),
                ('documentID', models.ForeignKey(to='restless.Document')),
                ('uidNumber', models.ForeignKey(to='restless.Employee')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='employeedocuments',
            name='documentID',
        ),
        migrations.RemoveField(
            model_name='employeedocuments',
            name='uidNumber',
        ),
        migrations.DeleteModel(
            name='EmployeeDocuments',
        ),
        migrations.AlterField(
            model_name='employee',
            name='created',
            field=models.DateField(default=datetime.datetime(2015, 3, 9, 3, 39, 55, 461635), auto_now_add=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='employee',
            name='modified',
            field=models.DateField(default=datetime.datetime(2015, 3, 9, 3, 39, 55, 461697), auto_now_add=True),
            preserve_default=True,
        ),
    ]
