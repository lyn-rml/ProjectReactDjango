from django.db import models
from django.db.models import Model
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
import datetime
import magic
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import Permission
from django.contrib.auth.models import AbstractUser, Permission,PermissionsMixin
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import serializers
current_year=0

abc=(datetime.datetime.now().year)-1,"-",datetime.datetime.now().year


YEAR_CHOICES = [(r,r)for r in range((datetime.datetime.now().year),3001)]

ext_validator=FileExtensionValidator(['pdf'])
def validate_file_nimetype(file):
 accept=['application/pdf']
 file_mime_type=magic.from_buffer(file.read(1024),mime=True)
 if file_mime_type not in accept:
   raise ValidationError






class Person(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number= models.CharField(max_length=20)
    profession = models.CharField(max_length=100)
    def validate_email(self, value):
     if not value or value.strip() == "":
        raise serializers.ValidationError("Email est requis et ne peut pas être vide.")
    
     # Check if the email already exists
     if Person.objects.filter(email=value).exists():
        raise serializers.ValidationError("Cet email existe déjà. Veuillez en choisir un autre.")
    
     return value
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
class CustomUserManager(BaseUserManager):
    def create_user(self, username, password, role, person=None, **extra_fields):
        if not username:
            raise ValueError("The Username must be set")
        if not password:
            raise ValueError("The password must be set")
        if not role:
            raise ValueError("The role must be set")

        user = self.model(username=username, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password, role='admin', person=None, **extra_fields):
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, password, role, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('member', 'Member'),
        ('admin', 'Admin'),
    )

    username = models.CharField(max_length=255, unique=True)
    password_hash = models.CharField(max_length=255)
    role = models.CharField(max_length=30, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    # The 'person' field is optional
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='users', null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['role']  # 'person' is no longer a required field

    def __str__(self):
        return self.username

    def set_password(self, raw_password):
        # Assuming password is hashed before saving
        self.password_hash = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password_hash)

class Member(Person):
    Father_name = models.CharField(max_length=100)
    Date_of_birth = models.DateField()
    Place_of_birth = models.CharField(max_length=100)
    Adresse = models.CharField(max_length=100)
    Blood_type = models.CharField(max_length=30)
    Work = models.CharField(max_length=100, default="")
    Domaine = models.CharField(max_length=100)
    is_another_association = models.BooleanField(default=False)
    association_name = models.CharField(max_length=100, blank=True, default="")
    Application_PDF = models.FileField(upload_to='PDF/Application_PDF', max_length=500, validators=[ext_validator, validate_file_nimetype])

    def clean(self):
        # Custom validation logic
        if self.is_another_association and not self.association_name:
            raise ValidationError({'association_name': "Ce champ est obligatoire si 'Autre association' est activé."})
        if not self.is_another_association and self.association_name:
            raise ValidationError({'association_name': "Ce champ doit être vide si 'Autre association' est désactivé."})

    def save(self, *args, **kwargs):
        # Call clean() method before saving
        self.clean()  # Valide les règles définies dans clean()
        super().save(*args, **kwargs)
    def delete(self, *args, **kwargs):
     Supervisor.objects.filter(Id_Membre=self).update(Id_Membre=None)
    # Only remove from Member table; leave Person data intact
     super(Member, self).delete(*args, **kwargs)    

    def __str__(self):
        if self.person_ptr:  # Check if person_ptr is available
            return str(self.person_ptr)
        return "Member (No person_ptr available)"
   
class Supervisor(Person):
    Id_Membre = models.ForeignKey(Member, on_delete=models.SET_NULL, null=True, blank=True)
    def delete(self, *args, **kwargs):
     supervisor = self.get_object()

    # Disassociate the supervisor from any related supervisor_internship
     supervisor_internship.objects.filter(supervisor_id=supervisor).update(supervisor_id=None)

    # Now delete the supervisor
     supervisor.delete(*args, **kwargs)
 
YEAR_CHOICES = [(year, str(year)) for year in range(2020, datetime.datetime.now().year + 5)]

class Internship(models.Model):
    id = models.AutoField(primary_key=True)
    Project_id = models.ForeignKey('Project', on_delete=models.PROTECT)
    intern_id = models.ForeignKey('Intern', on_delete=models.PROTECT)
    University = models.CharField(max_length=50, default="")
    Start_Date = models.DateField(default=timezone.now)
    End_Date = models.DateField(default=timezone.now)
    Year_of_study = models.CharField(max_length=20, default="") # 2024-2025
    Project_year = models.IntegerField(choices=YEAR_CHOICES, default=datetime.datetime.now().year)
    Promotion = models.CharField(max_length=30, blank=True) #L3 
    Certified = models.BooleanField(default=False)
    PDF_Agreement = models.FileField(upload_to='PDF/Agreements_PDF', max_length=500, validators=[ext_validator, validate_file_nimetype])
    PDF_Prolongement = models.FileField(null=True, upload_to='PDF/Prolongments_PDF', max_length=500, validators=[ext_validator, validate_file_nimetype])
    PDF_Certified = models.FileField(null=True, upload_to='PDF/Certificates_PDF', max_length=500, validators=[ext_validator, validate_file_nimetype])
    Code_file = models.FileField(upload_to='Code/Zip', max_length=500, null=True)
    Report_PDF= models.FileField(upload_to='Docs/Rapports_Docs', max_length=500, null=True)
    Presentation_PDF = models.FileField(upload_to='Presentations/Interns_Presentation', max_length=500, null=True)
    def clean(self):
       if self.Certified:
        missing_fields = []

        if not self.PDF_Certified:
            missing_fields.append("PDF Certificate")
        if not self.Report_PDF:
            missing_fields.append("Rapport")
        if not self.Presentation_PDF:
            missing_fields.append("Presentation")
        if not self.Code_file:
            missing_fields.append("Code")

        if missing_fields:
            raise ValidationError(
                f"The following fields are required when 'Certified' is True: {', '.join(missing_fields)}"
            )
        super().clean()  # Call the base class's clean method
    class Meta:
       unique_together = ('Project_id', 'intern_id')

  

class Intern(Person):
    Id_Membre = models.ForeignKey(Member, on_delete=models.SET_NULL, null=True, blank=True)
    available=models.BooleanField(default=False)
  
class Project(models.Model):
 id=models.AutoField(primary_key=True)
 Domain=models.CharField(max_length=30,default="")
 Title=models.CharField(max_length=50,unique=True)
 Speciality=models.CharField(max_length=30,default="")
 PDF_subject=models.FileField(upload_to='PDF/Project_Subject_PDF',max_length=500,validators=[ext_validator,validate_file_nimetype])
 is_taken=models.BooleanField(default=False)
 Date_register=models.DateField(default=timezone.now)
 def __str__(self):
       return self.Title
 def delete(self):
   self.PDF_subject.delete()
   super().delete()
class SupervisorRole(models.TextChoices):
    ADMIN = 'Admin', 'Admin'
    OTHER = 'Other', 'Other'
class supervisor_internship(models.Model):
    id = models.AutoField(primary_key=True)
    supervisor_id = models.ForeignKey(Supervisor, on_delete=models.CASCADE)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    Role = models.CharField(
        max_length=30,
        choices=SupervisorRole.choices,  # Enforcing choices for role
        default=SupervisorRole.OTHER  # Default role if not specified
    )

    def __str__(self):
        return f"{self.supervisor_id} - {self.project_id} - {self.Role}"
    
class Payment_history(models.Model):
   id=models.AutoField(primary_key=True)
   Id_Membre = models.ForeignKey(Member, on_delete=models.SET_NULL, null=True, blank=True)
   Payment_received_PDF=models.FileField(upload_to='PDF/Payment', max_length=500, null=True)
   Payment_date= models.DateField(default=timezone.now)
   Next_Payment_date= models.DateField(default=timezone.now)
   payed=models.BooleanField(default=False)
# details add it from admin info page 

