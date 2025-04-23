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
from django.contrib.auth.models import AbstractUser, Permission
from django.db import models

current_year=0

abc=(datetime.datetime.now().year)-1,"-",datetime.datetime.now().year


YEAR_CHOICES = [(r,r)for r in range((datetime.datetime.now().year),3001)]

ext_validator=FileExtensionValidator(['pdf'])
def validate_file_nimetype(file):
 accept=['application/pdf']
 file_mime_type=magic.from_buffer(file.read(1024),mime=True)
 if file_mime_type not in accept:
   raise ValidationError


class CustomUser(AbstractUser):  # Fixed capitalization
    ADMIN = 'admin'
    MEMBER = 'member'
    
    TYPE_CHOICES = [
        (ADMIN, 'Admin'),
        (MEMBER, 'Member'),
    ]
    
    type_of_user = models.CharField(
        max_length=10,
        choices=TYPE_CHOICES,
        default=MEMBER,
    )
    
    def save(self, *args, **kwargs):
        self.full_clean()  # Ensures clean() is called
        super().save(*args, **kwargs)
        self.assign_permissions()  # Auto-assign permissions on save
    
    def assign_permissions(self):
        """Assign permissions based on user type"""
        if self.type_of_user == self.ADMIN:
            # Example: Give all permissions
            self.is_staff = True
            self.is_superuser = True
        else:
            # Member permissions (customize as needed)
            self.is_staff = False
            self.is_superuser = False
            
        # Clear existing permissions and assign new ones
        self.user_permissions.clear()
        
        # Example: Assign view permissions to members
        if self.type_of_user == self.MEMBER:
            view_perm = Permission.objects.get(codename='view_member')
            self.user_permissions.add(view_perm)
    
# i want to add permisions depend on type of user 
    type_of_user = models.CharField(
        max_length=10,
        choices=TYPE_CHOICES,
        default=MEMBER,
    )   

class person(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    profession = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
class Member(models.Model):
 id=models.AutoField(primary_key=True)
 person_id=models.ForeignKey(person, on_delete=models.SET_NULL,null=True,related_name='member_person')
 Father_name=models.CharField(max_length=100)
 Date_of_birth=models.DateField()
 Place_of_birth=models.CharField(max_length=100)
 Adresse=models.CharField(max_length=100)
 Blood_type=models.CharField(max_length=30)
 Work=models.CharField(max_length=100,default="")
 Domaine=models.CharField(max_length=100)
 is_another_association = models.BooleanField(default=False)
 association_name = models.CharField(max_length=100, blank=True, default="")
 Application_PDF=models.FileField(upload_to='PDF/Application_PDF',max_length=500,validators=[ext_validator,validate_file_nimetype])

 def clean(self):
    if self.is_another_association and not self.association_name:
        raise ValidationError({'association_name': "Ce champ est obligatoire si 'Autre association' est activé."})
    if not self.is_another_association and self.association_name:
        raise ValidationError({'association_name': "Ce champ doit être vide si 'Autre association' est désactivé."})

   #i want to call clean bofor saving the data      
def __str__(self):
    if self.person_id:
        return str(self.person_id)

class Supervisor(models.Model):
 id=models.AutoField(primary_key=True)
 person_id=models.ForeignKey(person, on_delete=models.SET_NULL,null=True,related_name='supervisor_person')
 Id_Membre = models.PositiveIntegerField(null=True, blank=True, default=None)
 
 
class Internship(models.Model):
    id = models.AutoField(primary_key=True)
    Project_id= models.ForeignKey('Project', on_delete=models.CASCADE)
    intern_id = models.ForeignKey('Intern', on_delete=models.CASCADE)
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
        if not self.Rapport:
            missing_fields.append("Rapport")
        if not self.Presentation:
            missing_fields.append("Presentation")
        if not self.Code:
            missing_fields.append("Code")

        if missing_fields:
            raise ValidationError(
                f"The following fields are required when 'Certified' is True: {', '.join(missing_fields)}"
            )
        super().clean()  # Call the base class's clean method
    class Meta:
       unique_together = ('Project_id', 'intern_id')

  

class Intern(models.Model):
    id = models.AutoField(primary_key=True)
    person_id=models.ForeignKey(person, on_delete=models.SET_NULL,related_name='Intern_person',null=True)
    Id_Membre = models.PositiveIntegerField(null=True, blank=True, default=None)
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

class supervisor_internship(models.Model):
    id = models.AutoField(primary_key=True)
    supervisor_id = models.ForeignKey(Supervisor, on_delete=models.CASCADE)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    Role = models.CharField(max_length=30)
    
class Payment_history(models.Model):
   id=models.AutoField(primary_key=True)
   Id_Membre = models.PositiveIntegerField(null=True, blank=True, default=None)
   Payment_received_PDF=models.FileField(upload_to='PDF/Payment', max_length=500, null=True)
   Payment_date= models.DateField(default=timezone.now)
   Next_Payment_date= models.DateField(default=timezone.now)
# details add it from admin info page 

