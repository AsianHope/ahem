# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Document',
            fields=[
                ('documentID', models.AutoField(serialize=False, primary_key=True)),
                ('description', models.CharField(max_length=256)),
                ('required', models.BooleanField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('uidNumber', models.AutoField(serialize=False, primary_key=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='EmployeeDocuments',
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
    ]
