import django_filters
from django_filters import rest_framework as filters
from rest_framework import generics
from .models import super_stage,Stage,Stagiaire,Membre,Superviser,stage_stagiaire
from django.db import models

class super_stagefilter(django_filters.FilterSet):
    # superviser_name=filters.CharFilter(field_name="superviser_name",method="filter_superviser_name")
    class Meta():
        model=super_stage
        fields={
         'superviser__Prenom':['icontains'],
         'superviser__Nom':['icontains'],
         'stage__Domain':['icontains'],
         'stage__Title':['icontains'],
         'stage__Speciality':['icontains'],
         'stage__Sujet_pris':['exact'],
         'is_admin':['exact'],
          }
    # def filter_superviser_name(self,queryset,name,value):
    #      return queryset.filter(models.Q(superviser__Nom__icontains=value) | models.Q(superviser__Prenom__icontains=value))
        

class stagefilter(django_filters.FilterSet):
    class Meta:
        model=Stage
        fields={
            'Title':['iexact'],
        }

class stage_stagiairefilter(django_filters.FilterSet):
     class Meta:
         model=stage_stagiaire
         fields={
         'stagiaire__Nom':['icontains'],
         'stagiaire__Prenom':['icontains'],
         'stage__Title':['iexact'],
         'Annee':['icontains'],
         'Promotion':['icontains'],
         'Certified':['exact'],
         'stage__id':['exact'],
         'stagiaire__id':['exact'],
        }
         
class superviserfilter(django_filters.FilterSet):
    # superviser_name=filters.CharFilter(field_name="superviser_name",method="filter_superviser_name")
    class Meta:
        model=Superviser
        fields={
            'Prenom':['icontains'],
            'Nom':['icontains'],
            'Email':['icontains'],
            'Profession':['icontains'],
        }
    # def filter_superviser_name(self,queryset,name,value):
    #      return queryset.filter(models.Q(Nom__icontains=value) | models.Q(Prenom__icontains=value))
        
class memberfilter(django_filters.FilterSet):
    class Meta:
        model=Membre
        fields={
            'Prenom':['icontains'],
            'Nom':['icontains'],
            'Adresse':['icontains'],
            'A_paye':['exact'],
        }


          