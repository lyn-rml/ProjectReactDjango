import django_filters
from .models import *
from django_filters import BooleanFilter
from django_filters import rest_framework as filters
class SupervisorInternshipFilter(django_filters.FilterSet):
    project_id = django_filters.NumberFilter(field_name="project_id__id", lookup_expr="exact")
    supervisor_id = django_filters.NumberFilter(field_name="supervisor_id__id", lookup_expr="exact") 
    supervisor_first_name = django_filters.CharFilter(field_name="supervisor_id__first_name", lookup_expr="icontains")
    supervisor_last_name = django_filters.CharFilter(field_name="supervisor_id__last_name", lookup_expr="icontains")
    project_title = django_filters.CharFilter(field_name="project_id__Title", lookup_expr="icontains")
    project_domain = django_filters.CharFilter(field_name="project_id__Domain", lookup_expr="icontains")
    project_speciality = django_filters.CharFilter(field_name="project_id__Speciality", lookup_expr="icontains")
    project_taken = django_filters.BooleanFilter(field_name="project_id__is_taken")
    project_date_register = django_filters.DateFilter(field_name="project_id__Date_register", lookup_expr="exact")

    class Meta:
        model = supervisor_internship
        fields = {
            'Role':['exact']
        }
   
        

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
     intern_first_name = filters.CharFilter(field_name='intern_id__first_name', lookup_expr="icontains")
     intern_last_name = filters.CharFilter(field_name='intern_id__last_name', lookup_expr="icontains")
     class Meta:
         model=Internship
         fields={
         'Project_year': ['icontains', 'gte', 'lte'],
         'Promotion':['icontains'],
         'Certified':['exact'],   
         'intern_id':['exact'],
         'Start_Date': ['exact', 'gte', 'lte'],  
         'End_Date': ['exact', 'gte', 'lte'],  
         'Project_id':['exact']
        }
         
class supervisorfilter(django_filters.FilterSet):
    no_member = filters.BooleanFilter(method='filter_no_member')
    id_member = django_filters.NumberFilter(field_name="Id_Membre")
    first_name = django_filters.CharFilter(field_name="person_ptr_id__first_name", lookup_expr="icontains")
    email = django_filters.CharFilter(field_name="person_ptr__email", lookup_expr="icontains")
    phone_number = django_filters.CharFilter(field_name='person_ptr__phone_number', lookup_expr="icontains")
    last_name = django_filters.CharFilter(field_name='person_ptr_id__last_name', lookup_expr="icontains")
    profession = django_filters.CharFilter(field_name='person_ptr__profession', lookup_expr="icontains")
    # superviser_name=filters.CharFilter(field_name="superviser_name",method="filter_superviser_name")
    def filter_no_member(self, queryset, name, value):
        if value:
            return queryset.filter(Id_Membre__isnull=True)
        return queryset
    class Meta:
        model=Supervisor
        fields={
            'Id_Membre': ['exact'],
           
        }
   
        
class memberfilter(django_filters.FilterSet):
   
    member_payed = BooleanFilter(field_name="latest_payment_payed", lookup_expr="exact")
    class Meta:
        model=Member
        fields={         
          'first_name': ['icontains'],
            'last_name': ['icontains'],
            'email': ['icontains'],
            'phone_number': ['icontains'],
            'Adresse': ['icontains'],
            'profession': ['icontains'],        
        }
class internFilter(django_filters.FilterSet):

    available = django_filters.BooleanFilter(field_name='available')
    

    class Meta:
        model = Intern
        fields = ['available']

class Paymentfilter(django_filters.FilterSet):

    class Meta:
        model=Payment_history
        fields={         
           'Id_Membre': ['exact'],
        }         