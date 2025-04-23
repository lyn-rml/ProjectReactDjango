import django_filters
from .models import *
from django_filters import BooleanFilter
from django_filters import rest_framework as filters
class SupervisorInternshipFilter(django_filters.FilterSet):
    is_admin = django_filters.BooleanFilter(field_name="is_admin")
    Project_id = django_filters.NumberFilter(field_name="project__id", lookup_expr="exact")  
    sup_id = django_filters.NumberFilter(field_name='superviser', lookup_expr="exact")

    # Champs liés via des relations (nested filters)
    first_name = django_filters.CharFilter(field_name="person_id__first_name", lookup_expr="icontains")
    last_name = django_filters.CharFilter(field_name="person_id__last_name", lookup_expr="icontains")
    project_domain = django_filters.CharFilter(field_name="Project__Domain", lookup_expr="icontains")
    project_title = django_filters.CharFilter(field_name="Project__Title", lookup_expr="icontains")
    project_speciality = django_filters.CharFilter(field_name="Project__Speciality", lookup_expr="icontains")
    project_taken = django_filters.BooleanFilter(field_name="Project__is_taken")
    project_date_register = django_filters.DateFilter(field_name="Project__Date_register", lookup_expr="exact")

    class Meta:
        model = supervisor_internship
        fields = [ 
            'is_admin', 'Project_id', 'sup_id'
        ]
   
        

class ProjectFilter(django_filters.FilterSet):
    supervisor_first_name = filters.CharFilter(field_name='Supervisor__person_id__first_name', lookup_expr="icontains")
    supervisor_last_name = filters.CharFilter(field_name='Supervisor__person_id__last_name', lookup_expr="icontains")
    intern_first_name = filters.CharFilter(field_name='intern__person_id__first_name', lookup_expr="icontains")
    intern_last_name = filters.CharFilter(field_name='intern__person_id__last_name', lookup_expr="icontains")
    class Meta:
        model = Project
        fields = {
            'id':['icontains'],
            'Title': ['icontains'],  
            'Domain': ['iexact', 'icontains'],  
            'Speciality': ['iexact', 'icontains'],  
            'is_taken': ['exact','icontains'],  
            'Date_register': ['exact', 'gte', 'lte'],   
            
               
        }

class stage_stagiairefilter(django_filters.FilterSet):
    
     class Meta:
         model=Internship
         fields={
         'Project_year': ['icontains', 'gte', 'lte'],
         'Promotion':['icontains'],
         'Certified':['exact'],   
         'intern_id':['exact'],
         'Start_Date': ['exact', 'gte', 'lte'],  
         'End_Date': ['exact', 'gte', 'lte'],  
        }
         
class supervisorfilter(django_filters.FilterSet):
    no_member = filters.BooleanFilter(method='filter_no_member')
    id_member = django_filters.NumberFilter(field_name="Id_Membre")
    first_name = django_filters.CharFilter(field_name="person_id__first_name", lookup_expr="icontains")
    email = django_filters.CharFilter(field_name="person_id__email", lookup_expr="icontains")
    phone_number = django_filters.CharFilter(field_name='person_id__phone_number', lookup_expr="icontains")
    last_name = django_filters.CharFilter(field_name='person_id__last_name', lookup_expr="icontains")
    email = django_filters.CharFilter(field_name='person_id__email', lookup_expr="icontains")
    profession = django_filters.CharFilter(field_name='person_id__profession', lookup_expr="icontains")
    # superviser_name=filters.CharFilter(field_name="superviser_name",method="filter_superviser_name")
    def filter_no_member(self, queryset, value):
        if value:
            return queryset.filter(Id_Membre__isnull=True)
        return queryset
    class Meta:
        model=Supervisor
        fields={
            'Id_Membre': ['exact'],
           
        }
   
        
class memberfilter(django_filters.FilterSet):
    is_sup = BooleanFilter(field_name="is_sup")
    first_name = django_filters.CharFilter(field_name="person_id__first_name")
    phone_number = django_filters.CharFilter(field_name='person_id__phone_number', lookup_expr="icontains")
    last_name = django_filters.CharFilter(field_name='person_id__last_name', lookup_expr="icontains")
    email = django_filters.CharFilter(field_name='person_id__email' ,lookup_expr="icontains")
    profession = django_filters.CharFilter(field_name='person_id__profession', lookup_expr="icontains")
    class Meta:
        model=Member
        fields={
           
            'Adresse':['icontains'],
            
            
        }
class internFilter(django_filters.FilterSet):

    available = django_filters.BooleanFilter(field_name='available')
    

    class Meta:
        model = Intern
        fields = ['available']

          