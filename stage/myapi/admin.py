from django.contrib import admin
from .models import *

# Register your models here.
class MembreAdmin(admin.ModelAdmin):
    list_display = ('id','Nom', 'Prenom', 'Date_naissance', 'Lieu_naissance', 'Telephone', 'Email', 'A_paye')  
    search_fields = ('id','Nom', 'Prenom', 'Date_naissance', 'Lieu_naissance', 'Telephone', 'Email', 'A_paye')  
    list_filter = ('Nom', 'Prenom', 'Date_naissance', 'Lieu_naissance', 'Telephone', 'Email', 'A_paye')  
    ordering = ('-Nom',)

# Superviser Admin
class SuperviserAdmin(admin.ModelAdmin):
    list_display = ('id','Nom', 'Prenom', 'Profession', 'Email', 'Telephone')  
    search_fields = ('id','Nom', 'Prenom', 'Profession', 'Email', 'Telephone')  
    list_filter = ('Nom', 'Prenom', 'Profession', 'Email', 'Telephone')
    ordering = ('-Nom',)

# Stagiaire Admin
class StagiaireAdmin(admin.ModelAdmin):
    list_display = ('id','Nom', 'Prenom', 'Email', 'Telephone', 'N_stage')  
    search_fields = ('id','Nom', 'Prenom', 'Email', 'Telephone', 'N_stage')  
    list_filter = ('Nom', 'Prenom', 'Email', 'Telephone')
    ordering = ('-Nom',)

# Stage Admin
class StageAdmin(admin.ModelAdmin):
    list_display = ('id','Title', 'Domain',"Date_register", 'Sujet_pris','Main_sup')  
    search_fields = ('id','Title', 'Domain', 'Sujet_pris','Main_sup')  
    list_filter = ('Title', 'Domain', 'Sujet_pris')  
    ordering = ('-Title',)

class SuperStageAdmin(admin.ModelAdmin):
    list_display = ('id','superviser', 'stage', 'is_admin')  
    search_fields = ('id','superviser__Nom', 'stage__Title')  
    list_filter = ('is_admin',)
    ordering = ('-id',)

# stage_stagiaire Admin
class StageStagiaireAdmin(admin.ModelAdmin):
    list_display = ('id','stage', 'stagiaire', 'Certified', 'Universite', 'Promotion', 'Annee_etude', 'Annee','PDF_Agreement','PDF_Prolongement','PDF_Certificate','Code','Rapport','Presentation','Date_debut','Date_fin')  
    search_fields = ('id','stagiaire__Nom', 'stagiaire__Prenom', 'stage__Title')  
    list_filter = ('id','stagiaire__Nom', 'stagiaire__Prenom', 'stage__Title')
    ordering = ('-stage','id')

# Registering the Admin classes
admin.site.register(super_stage, SuperStageAdmin)
admin.site.register(stage_stagiaire, StageStagiaireAdmin)
admin.site.register(Membre, MembreAdmin)
admin.site.register(Superviser, SuperviserAdmin)
admin.site.register(Stagiaire, StagiaireAdmin)
admin.site.register(Stage, StageAdmin)