from django.contrib import admin
from .models import *
from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# Register your models here.
class MemberAdmin(admin.ModelAdmin):
      list_display = (
        'id', 'person_id', 'Father_name', 'Date_of_birth', 
        'Place_of_birth', 'Adresse', 'Blood_type', 'Work', 
        'Domaine', 'is_another_association', 'association_name', 'Application_PDF'
    )
    # Fields to be searchable in the admin interface
      search_fields = (
        'id', 'Father_name', 'Date_of_birth', 'Place_of_birth', 
        'Adresse', 'Blood_type', 'Work', 'Domaine', 'association_name'
    )

    # Fields to filter the list by in the admin interface
      list_filter = (
        'Date_of_birth', 'Blood_type', 'Work', 'Domaine', 
        'is_another_association', 'association_name'
    )
    
    # Define the ordering of the list view
      ordering = ('-Date_of_birth',)


# Superviser Admin
class SupervisorAdmin(admin.ModelAdmin):
      list_display = (
        'id', 'person_id', 'Id_Membre'
    )
    
    # Fields to be searchable in the admin interface
      search_fields = (
        'id', 'Id_Membre'
    )

    # Fields to filter the list by in the admin interface
      list_filter = (
         'Id_Membre','id'
    )
    
    # Define the ordering of the list view
      ordering = ('-id',)

# Stagiaire Admin
class InternAdmin(admin.ModelAdmin):
  # Display fields in the admin list view
    list_display = ['id', 'get_full_name']

    # Method to display full name by combining 'Nom' and 'Prenom'
    def get_full_name(self, obj):
        return f"{obj.person_id.Nom} {obj.person_id.Prenom}"
    get_full_name.short_description = 'Nom Complet'

    # Fields to be searchable in the admin interface
    search_fields = ('id','person_id')


    # Define the ordering of the list view
    ordering = ('-id',)  # You can change the field here for ordering

# Stage Admin
class projectAdmin(admin.ModelAdmin):
    list_display = ('id', 'Title', 'Domain', 'Date_register', 'is_taken') 

    # Search fields in the admin interface
    search_fields = ('id', 'Title', 'Domain', 'is_taken')

    # Filter fields in the admin interface
    list_filter = ('Title', 'Domain', 'is_taken')

    # Ordering of the list view
    ordering = ('-Date_register',)



class supervisorInternshipAdmin(admin.ModelAdmin):
    list_display = ('id','supervisor_id', 'project_id', 'Role')  
    search_fields = ('id','supervisor_id', 'project_id', 'Role')  
    list_filter = ('Role',)
    ordering = ('-id',)
    
class internshipAdminForm(forms.ModelForm):
    class Meta:
        model = Internship
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Make fields optional by default
        self.fields['PDF_Certified'].required = False
        self.fields['Report_PDF'].required = False
        self.fields['Presentation_PDF'].required = False
        self.fields['Code_file'].required = False
        self.fields['PDF_Prolongement'].required = False

# stage_stagiaire Admin
class internshipAdmin(admin.ModelAdmin):
    list_display = ('id', 'Project_id', 'intern_id', 'Certified', 'University', 'Promotion', 'Year_of_study', 'Project_year', 
                    'PDF_Agreement', 'PDF_Prolongement', 'PDF_Certified', 'Code_file', 'Report_PDF', 'Presentation_PDF', 'Start_Date', 'End_Date')

    # Fields to search in the admin interface
    search_fields = ('id', 'Project_id__Title')  

    # Filters in the admin interface
    list_filter = ( 'Project_id__Title', 'Certified')

    # Ordering of the list view
    ordering = ('-Project_id', 'id')


# Registering the Admin classes
admin.site.register(supervisor_internship, supervisorInternshipAdmin)
admin.site.register(Internship, internshipAdmin)
admin.site.register(Member, MemberAdmin)
admin.site.register(Supervisor, SupervisorAdmin)
admin.site.register(Intern,InternAdmin)
admin.site.register(Project, projectAdmin)
admin.site.register(CustomUser)