from django.db import models
from django.db.models import Model
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
import datetime
import magic
from django.utils import timezone
from django.core.exceptions import ValidationError
current_year=0

abc=(datetime.datetime.now().year)-1,"-",datetime.datetime.now().year


YEAR_CHOICES = [(r,r)for r in range((datetime.datetime.now().year),3001)]

ext_validator=FileExtensionValidator(['pdf'])
def validate_file_nimetype(file):
 accept=['application/pdf']
 file_mime_type=magic.from_buffer(file.read(1024),mime=True)
 if file_mime_type not in accept:
   raise ValidationError
 
class Membre(models.Model):
 id=models.AutoField(primary_key=True)
 Nom=models.CharField(max_length=100)
 Prenom=models.CharField(max_length=100)
 Nom_pere=models.CharField(max_length=100)
 Date_naissance=models.DateField()
 Lieu_naissance=models.CharField(max_length=100)
 Telephone=models.CharField(max_length=100)
 Adresse=models.CharField(max_length=100)
 Groupe_sanguin=models.CharField(max_length=30)
 Travail=models.CharField(max_length=100,default="")
 Profession=models.CharField(max_length=100)
 Domaine=models.CharField(max_length=100)
 Email=models.EmailField(unique=True,max_length=50)
 Autre_association = models.BooleanField(default=False)
 Nom_autre_association = models.CharField(max_length=100, blank=True, default="")
 Application_PDF=models.FileField(upload_to='PDF/Application_PDF',max_length=500,validators=[ext_validator,validate_file_nimetype])
 A_paye=models.BooleanField()
 is_sup = models.BooleanField(default=False)
 

 def clean(self):
        if self.Autre_association and not self.Nom_autre_association:
            raise ValidationError({'Nom_autre_association': "Ce champ est obligatoire si 'Autre_association' est activé."})
        if not self.Autre_association and self.Nom_autre_association:
            raise ValidationError({'Nom_autre_association': "Ce champ doit être vide si 'Autre_association' est désactivé."})
   #i want to call clean bofor saving the data      
 def __str__(self):
   return self.Nom +" "+self.Prenom

class Superviser(models.Model):
 id=models.AutoField(primary_key=True)
 Nom=models.CharField(max_length=30)
 Prenom=models.CharField(max_length=30)
 Telephone=models.CharField(max_length=30)
 Id_Membre = models.PositiveIntegerField(null=True, blank=True, default=None)
 Profession=models.CharField(max_length=30)
 Email=models.EmailField(unique=True)
 def __str__(self):
   return self.Nom +" "+self.Prenom
 
class stage_stagiaire(models.Model):
    id = models.AutoField(primary_key=True)
    stage = models.ForeignKey('Stage', on_delete=models.CASCADE)
    stagiaire = models.ForeignKey('Stagiaire', on_delete=models.CASCADE)
    PDF_Agreement = models.FileField(upload_to='PDF/Agreements_PDF', max_length=500, validators=[ext_validator, validate_file_nimetype])
    PDF_Prolongement = models.FileField(null=True, upload_to='PDF/Prolongments_PDF', max_length=500, validators=[ext_validator, validate_file_nimetype])
    Certified = models.BooleanField(default=False)
    PDF_Certificate = models.FileField(null=True, upload_to='PDF/Certificates_PDF', max_length=500, validators=[ext_validator, validate_file_nimetype])
    Universite = models.CharField(max_length=50, default="")
    Promotion = models.CharField(max_length=30, blank=True)
    Annee_etude = models.CharField(max_length=20, default="")
    Annee = models.IntegerField(choices=YEAR_CHOICES, default=datetime.datetime.now().year)
    Code = models.FileField(upload_to='Code/Zip', max_length=500, null=True)
    Date_debut = models.DateField(default=timezone.now)
    Date_fin = models.DateField(default=timezone.now)
    Rapport = models.FileField(upload_to='Docs/Rapports_Docs', max_length=500, null=True)
    Presentation = models.FileField(upload_to='Presentations/Interns_Presentation', max_length=500, null=True)

    class Meta:
        unique_together = ('stage', 'stagiaire')

    def clean(self):
       if self.Certified:
        missing_fields = []

        if not self.PDF_Certificate:
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


  

class Stagiaire(models.Model):
    id = models.AutoField(primary_key=True)
    Nom = models.CharField(max_length=30)
    Prenom = models.CharField(max_length=30)
    Email = models.EmailField(unique=True, default="")
    Telephone = models.CharField(max_length=50)
    N_stage = models.ManyToManyField('Stage', through='stage_stagiaire')
    available=models.BooleanField(default=False)
  
class Stage(models.Model):
 id=models.AutoField(primary_key=True)
 Domain=models.CharField(max_length=30,default="")
 Title=models.CharField(max_length=50,unique=True)
 Speciality=models.CharField(max_length=30,default="")
 PDF_sujet=models.FileField(upload_to='PDF/Project_Subject_PDF',max_length=500,validators=[ext_validator,validate_file_nimetype])
 Sujet_pris=models.BooleanField(default=False)
 Supervisers=models.ManyToManyField(Superviser,through="super_stage")
 Stagiers=models.ManyToManyField('Stagiaire',through="stage_stagiaire")
 Date_register=models.DateField(default=timezone.now)
 Main_sup = models.ForeignKey(Superviser, on_delete=models.SET_NULL,null=True,related_name='stages_as_main_sup')
 def __str__(self):
       return self.Title
 def delete(self):
   self.PDF_sujet.delete()
   super().delete()

class super_stage(models.Model):
    id = models.AutoField(primary_key=True)
    superviser = models.ForeignKey(Superviser, on_delete=models.CASCADE)
    stage = models.ForeignKey(Stage, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)

    class Meta:
        # Ensure that only one admin supervisor can be assigned to a stage
        constraints = [
            models.UniqueConstraint(fields=['stage', 'superviser'], condition=models.Q(is_admin=True), name='unique_admin_supervisor')
        ]

    


