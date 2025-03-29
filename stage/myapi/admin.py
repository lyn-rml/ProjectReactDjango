from django.contrib import admin
from .models import *

# Register your models here.
class MembreAdmin(admin.ModelAdmin):
    list_display = ('Nom', 'Prenom', 'Date_naissance', 'Lieu_naissance', 'Telephone', 'Email', 'A_paye')  
    search_fields = ('Nom', 'Prenom', 'Date_naissance', 'Lieu_naissance', 'Telephone', 'Email', 'A_paye')  
    list_filter = ('Nom', 'Prenom', 'Date_naissance', 'Lieu_naissance', 'Telephone', 'Email', 'A_paye')  
    ordering = ('-Nom',)

# Superviser Admin
class SuperviserAdmin(admin.ModelAdmin):
    list_display = ('Nom', 'Prenom', 'Profession', 'Email', 'Telephone')  
    search_fields = ('Nom', 'Prenom', 'Profession', 'Email', 'Telephone')  
    list_filter = ('Nom', 'Prenom', 'Profession', 'Email', 'Telephone')
    ordering = ('-Nom',)

# Stagiaire Admin
class StagiaireAdmin(admin.ModelAdmin):
    list_display = ('Nom', 'Prenom', 'Email', 'Telephone', 'N_stage')  
    search_fields = ('Nom', 'Prenom', 'Email', 'Telephone', 'N_stage')  
    list_filter = ('Nom', 'Prenom', 'Email', 'Telephone', 'N_stage')
    ordering = ('-Nom',)

# Stage Admin
class StageAdmin(admin.ModelAdmin):
    list_display = ('Title', 'Domain', 'Date_debut', 'Date_fin', 'Sujet_pris')  
    search_fields = ('Title', 'Domain', 'Date_debut', 'Date_fin', 'Sujet_pris')  
    list_filter = ('Title', 'Domain', 'Date_debut', 'Date_fin', 'Sujet_pris')  
    ordering = ('-Title',)

class SuperStageAdmin(admin.ModelAdmin):
    list_display = ('superviser', 'stage', 'is_admin')  
    search_fields = ('superviser__Nom', 'stage__Title')  
    list_filter = ('is_admin',)
    ordering = ('-id',)

# stage_stagiaire Admin
class StageStagiaireAdmin(admin.ModelAdmin):
    list_display = ('stage', 'stagiaire', 'Certified', 'Universite', 'Promotion', 'Annee_etude', 'Annee','PDF_Agreement','PDF_Prolongement','PDF_Certificate','Code','Rapport','Presentation')  
    search_fields = ('stagiaire__Nom', 'stagiaire__Prenom', 'stage__Title')  
    list_filter = ('Certified', 'Universite', 'Annee')
    ordering = ('-Annee',)

# Registering the Admin classes
admin.site.register(super_stage, SuperStageAdmin)
admin.site.register(stage_stagiaire, StageStagiaireAdmin)
admin.site.register(Membre, MembreAdmin)
admin.site.register(Superviser, SuperviserAdmin)
admin.site.register(Stagiaire, StagiaireAdmin)
admin.site.register(Stage, StageAdmin)