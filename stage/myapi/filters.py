import django_filters
from .models import super_stage,Stage,Membre,Superviser,stage_stagiaire,Stagiaire
from django_filters import BooleanFilter
from django_filters import rest_framework as filters

class super_stagefilter(django_filters.FilterSet):
    is_admin = django_filters.BooleanFilter(field_name="is_admin")
    stage_id = django_filters.NumberFilter(field_name="stage__id", lookup_expr="exact")  
    sup_id=django_filters.NumberFilter(field_name='superviser',lookup_expr="exact")
    # superviser_name=filters.CharFilter(field_name="superviser_name",method="filter_superviser_name")
    class Meta():
        model=super_stage
        fields={
         'superviser__Prenom':['icontains'],
         'superviser__Nom':['icontains'],
         'stage__Domain':['icontains'],
         'stage__Title':['icontains'],
         'stage__Speciality':['icontains'],
         'stage__Sujet_pris':['icontains'],
         'stage__Date_register': ['icontains'],
         
          }
    # def filter_superviser_name(self,queryset,name,value):
    #      return queryset.filter(models.Q(superviser__Nom__icontains=value) | models.Q(superviser__Prenom__icontains=value))
        

class StageFilter(django_filters.FilterSet):
    class Meta:
        model = Stage
        fields = {
            'id':['icontains'],
            'Title': ['icontains'],  
            'Domain': ['iexact', 'icontains'],  
            'Speciality': ['iexact', 'icontains'],  
            'Sujet_pris': ['exact','icontains'],  
            'Date_register': ['exact', 'gte', 'lte'],  
            'Main_sup': ['exact'],  
            'Supervisers__Nom': ['icontains'],  # Filtrer par superviseur
            'Stagiers__Nom': ['icontains'],  # Filtrer par stagiaire
        }

class stage_stagiairefilter(django_filters.FilterSet):
     class Meta:
         model=stage_stagiaire
         fields={
        'stage__id': ['exact'],
         'stagiaire__Nom':['icontains'],
         'stagiaire__Prenom':['icontains'],
         'stage__Title':['iexact'],
         'Annee': ['icontains', 'gte', 'lte'],
         'Promotion':['icontains'],
         'Certified':['exact'],
       
         'stagiaire__id':['exact'],
         'Date_debut': ['exact', 'gte', 'lte'],  
         'Date_fin': ['exact', 'gte', 'lte'],  
        }
         
class superviserfilter(django_filters.FilterSet):
    no_member = filters.BooleanFilter(method='filter_no_member')
    id_member = django_filters.NumberFilter(field_name="Id_Membre")
    # superviser_name=filters.CharFilter(field_name="superviser_name",method="filter_superviser_name")
    def filter_no_member(self, queryset, name, value):
        if value:
            return queryset.filter(Id_Membre__isnull=True)
        return queryset
    class Meta:
        model=Superviser
        fields={
            'Prenom':['icontains'],
            'Nom':['icontains'],
            'Email':['icontains'],
            'Profession':['icontains'],
            'Id_Membre': ['exact']
        }
    # def filter_superviser_name(self,queryset,name,value):
    #      return queryset.filter(models.Q(Nom__icontains=value) | models.Q(Prenom__icontains=value))
        
class memberfilter(django_filters.FilterSet):
    is_sup = BooleanFilter(field_name="is_sup")
    class Meta:
        model=Membre
        fields={
            'Prenom':['icontains'],
            'Nom':['icontains'],
            'Adresse':['icontains'],
            'A_paye':['exact'],
            
        }
class StagiaireFilter(django_filters.FilterSet):
    available = django_filters.BooleanFilter(field_name='available')
    N_stage = django_filters.ModelMultipleChoiceFilter(
        field_name='N_stage',
        queryset=Stage.objects.all()
    )

    class Meta:
        model = Stagiaire
        fields = ['available', 'N_stage']

          