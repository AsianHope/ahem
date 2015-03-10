from django.db import models
from pygments.lexers import get_all_lexers
from pygments.styles import get_all_styles
import datetime

LEXERS = [item for item in get_all_lexers() if item[1]]
LANGUAGE_CHOICES = sorted([(item[1][0], item[0]) for item in LEXERS])
STYLE_CHOICES = sorted((item,item) for item in get_all_styles())

DEPARTMENTS = (
        ('ADMIN-KH','Admin Cambodia'),
        ('ADMIN-USA','Admin USA'),
        ('AHIS','Asian Hope School'),
        ('HELP-ASIA','HELP Asia'),
        ('HELP-USA','HELP USA'),
        ('LIS','Logos'),
        ('MIS','MIS Department'),
        ('VDP-G','VDP General'),
        ('VDP-TK','VDP Toul Kork'),
        ('VDP-PPT','VDP Phnom Penh Thmey'),
        ('VDP-NKO','VDP NKO'),
        ('MULTI','Multiple Departments'),
        ('CPU','Computer'),
)

EMPLOYEETYPES = (
    ('PT','Part Time'),
    ('FT','Full Time'),
)

FAITHS = (
    ('CR', 'Christian'),
    ('BU', 'Buddhist'),
    ('IS', 'Muslim'),
    ('NF','No Faith'),
    ('UD','Undeclared'),
)

MARITALSTATUSES = (
    ('S', 'Single'),
    ('M', 'Married'),
    ('D', 'Divorced'),
)

GENDERS = (
    ('M', 'Male'),
    ('F', 'Female'),
)

DEGREES = (
    ('PR', 'Primary School (or equivalent)'),
    ('HS', 'High School (or equivalent)'),
    ('BS', 'Bachelors'),
    ('MS', 'Masters'),
    ('PHD', 'PHD'),
)

class Employee(models.Model):
    #LDAP Attributes (imported)
    uidNumber = models.IntegerField(primary_key=True,unique=True)
    employeeNumber = models.IntegerField(null=True)
    cn = models.CharField('cn', max_length=32,unique=True,default='')
    uid = models.CharField('username', max_length=32,null=True)
    sn = models.CharField('Surname', max_length=32,null=True)
    c = models.CharField('Nationality',max_length=2,null=True)
    departmentNumber = models.CharField('Department',choices=DEPARTMENTS,max_length=8,null=True)
    displayName = models.CharField(max_length=32,null=True)
    employeeType = models.CharField(max_length=2,choices=EMPLOYEETYPES,null=True)
    gecos = models.CharField('Full Name',max_length=32,null=True)
    givenName = models.CharField('Given Name',max_length=32,null=True)
    jpegPhoto = models.URLField('Link to Image',null=True)
    l = models.CharField('Work Country',max_length=2,null=True)
    mail = models.EmailField('Email Address',null=True)
    mobile = models.CharField('Phone Number',max_length=32,null=True)
    postalAddress = models.TextField('Present Address',null=True)
    title = models.CharField('Title',max_length=32,null=True)
    appleBirthday = models.CharField('DOB in Apple Format',max_length=64,null=True)

    #imported, but not specifically ldap attributes
    givenNamekh = models.CharField('Given Name in Khmer',max_length=32,null=True)
    snkh = models.CharField('Surname in Khmer',max_length=32,null=True)
    mailpr = models.EmailField('Personal Email Address',null=True)

    #extended attributes
    created = models.DateField(auto_now_add=True,editable=False,default=datetime.datetime.today())
    created_by = models.ForeignKey('auth.User', related_name='employees',null=True)
    modified= models.DateField(auto_now_add=True,default=datetime.datetime.today())
    startdate = models.DateField(null=True)
    enddate = models.DateField(null=True)
    faith = models.CharField(choices=FAITHS,max_length=2,default='UD')
    maritalstatus = models.CharField(choices=MARITALSTATUSES,max_length=1,default='S')
    children = models.IntegerField(null=True)
    gender = models.CharField(choices=GENDERS,max_length=1,default='M')
    enteredCambodia = models.DateField(null=True)
    degree = models.CharField(choices=DEGREES,max_length=3,null=True)
    degreeArea = models.CharField(max_length=16,null=True)
    visaExpires = models.DateField(null=True)
    nssf = models.IntegerField(null=True)
    notes = models.TextField(null=True)
    idnumber = models.CharField('Passport/ID Card Number',max_length=32,null=True)
    insurance = models.CharField('Insurance Provider', max_length=32,null=True)


    '''
    # We'll have to look at this closer to see how we can massage incoming data
    def save(self, *args, **kwargs):
        self.uid = str(self.cn)
        self.mail = str(self.uid)+'@asianhope.org'
        self.gecos = str(self.givenName) + ' ' + str(self.sn)
        self.displayName = str(self.uid)
        self.employeeNumber = self.uidNumber
        super(Employee, self).save(*args, **kwargs)
    '''
    def __unicode__(self):
        return str(self.uidNumber)

class Document(models.Model):
    documentID = models.AutoField(primary_key=True)
    description = models.CharField(max_length=256)
    required = models.BooleanField(default=True)

class EmployeeDocument(models.Model):
    uidNumber = models.ForeignKey(Employee)
    documentID = models.ForeignKey(Document)
    url = models.URLField()
    updated = models.DateTimeField()
