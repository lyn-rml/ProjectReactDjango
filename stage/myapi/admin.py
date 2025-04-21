from django.contrib import admin
from .models import *
from django import forms
from .models import CustomUser
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
 class StagiaireAdmin(admin.ModelAdmin):
    list_display = ['id', 'Nom', 'Prenom', 'Email', 'Telephone', 'get_N_stage']

    def get_N_stage(self, obj):
        return ", ".join([str(stage) for stage in obj.N_stage.all()])
    get_N_stage.short_description = 'Stages'
     
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
    
class StageStagiaireAdminForm(forms.ModelForm):
    class Meta:
        model = stage_stagiaire
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Make fields optional by default
        self.fields['PDF_Certificate'].required = False
        self.fields['Rapport'].required = False
        self.fields['Presentation'].required = False
        self.fields['Code'].required = False
        self.fields['PDF_Prolongement'].required = False

# stage_stagiaire Admin
class StageStagiaireAdmin(admin.ModelAdmin):
    form = StageStagiaireAdminForm  # Connect the custom form here

    list_display = ('id','stage', 'stagiaire', 'Certified', 'Universite', 'Promotion', 'Annee_etude', 'Annee',
                    'PDF_Agreement','PDF_Prolongement','PDF_Certificate','Code','Rapport','Presentation','Date_debut','Date_fin')  
    search_fields = ('id','stagiaire__Nom', 'stagiaire__Prenom', 'stage__Title')  
    list_filter = ('stagiaire__Nom', 'stagiaire__Prenom', 'stage__Title')
    ordering = ('-stage','id')


# Registering the Admin classes
admin.site.register(super_stage, SuperStageAdmin)
admin.site.register(stage_stagiaire, StageStagiaireAdmin)
admin.site.register(Membre, MembreAdmin)
admin.site.register(Superviser, SuperviserAdmin)
admin.site.register(Stagiaire, StagiaireAdmin)
admin.site.register(Stage, StageAdmin)
admin.site.register(CustomUser)