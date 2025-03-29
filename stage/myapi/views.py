from django.shortcuts import render
from .models import Stage,Stagiaire,Superviser,Membre
from django.db.models import F, Value, CharField
from django.db.models.functions import Concat
# Create your views here.

from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser,JSONParser,FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework import viewsets
from .models import Stage,Stagiaire,Superviser,Membre,super_stage,stage_stagiaire
from .serializers import StageSerializer,StagiaireSerializer,SuperviserSerializer,supstageSerializer
from .serializers import MembreSerializer,miniMemberSerializer,join_project_stagierSerializer
from .filters import super_stagefilter,StageFilter,stage_stagiairefilter,superviserfilter,memberfilter
from django_filters.rest_framework import DjangoFilterBackend
from django.views.generic.list import ListView
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 5


class StageViewSet(viewsets.ModelViewSet):
    queryset = Stage.objects.all()
    serializer_class = StageSerializer
    filter_backends=(DjangoFilterBackend,)
    filterset_class = StageFilter
    pagination_class= StandardResultsSetPagination
    # parser_classes=[MultiPartParser,FormParser,JSONParser]
    http_method_names = ['delete', 'get','post','put','head']

    def partial_update(self, request, *args, **kwargs):
       stage_object=self.get_object()
       data=request.data
       stage_object.Title=data.get("Title",stage_object.Title)
       stage_object.Domain=data.get("Domain",stage_object.Domain)
       stage_object.Speciality=data.get("Speciality",stage_object.Speciality) 
       stage_object.PDF_sujet=data.get("PDF_sujet",stage_object.PDF_sujet)
       stage_object.Sujet_pris=data.get("Sujet_pris",stage_object.Sujet_pris)
       if(stage_object.Sujet_pris=="true"): 
          stage_object.Sujet_pris=True
       if(stage_object.Sujet_pris=="false"):
          stage_object.Sujet_pris=False
       stage_object.Date_debut=data.get("Date_debut",stage_object.Date_debut)
       stage_object.Date_fin=data.get("Date_fin",stage_object.Date_fin)
       stage_object.save() 
       serializer=StageSerializer(stage_object)
       return Response(serializer.data)

    @action(detail=False,methods=('get','post'))
    def get_all(self, request):
        if request.method == 'GET':
            queryset = Stage.objects.all()
            sujet_pris = request.query_params.get('Sujet_pris')
            if sujet_pris is not None:  
                queryset = queryset.filter(Sujet_pris=(sujet_pris.lower() == "true"))
            
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
      
        if (request.method=='POST'):
           
            serializer=self.get_serializer(data=(request.data))#,request.FILES))  #request.FILES
            if(serializer.is_valid()):

               serializer.save()
               return Response(serializer.data)
            else:
               return Response(serializer.errors)

class sup_stageViewSet(viewsets.ModelViewSet):
    queryset=super_stage.objects.all()
    serializer_class=supstageSerializer
    filter_backends=(DjangoFilterBackend,)
    filterset_class=super_stagefilter
    pagination_class=StandardResultsSetPagination
    # parser_classes=[MultiPartParser,FormParser,JSONParser]
    http_method_names = ['delete', 'get','post','put','patch','head']
      #filter actions
    def get_filtered_queryset(self):
        queryset = super_stage.objects.all()
        filterset = self.filterset_class(self.request.GET, queryset=queryset)
        if filterset.is_valid():
            return filterset.qs
        return queryset
    #filter admin only
    def get_filtered_queryset_admin(self):
        queryset = super_stage.objects.all()
        filterset = self.filterset_class(self.request.GET, queryset=queryset)
      #   pagination=self.pagination_class(self.request.GET,queryset=queryset)
        if filterset.is_valid():
            return filterset.qs
        return queryset
      #get method for admin only
      #i don't understand why it nessery to be an admin ??
    def list(self,request):
      queryset=self.get_filtered_queryset_admin()
      page = self.paginate_queryset(queryset)
      if page is not None:
            serializer = supstageSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
      # else:
      #       serializer = supstageSerializer(queryset, many=True)
      #       return Response(serializer.data, status=status.HTTP_200_OK)
    #delete method
    def destroy(self, request, pk=None, *args, **kwargs):
        instance = self.get_object()
        # you custom logic #
        return super(sup_stageViewSet, self).destroy(request, pk, *args, **kwargs)
    #patch method
    def partial_update(self, request, *args, **kwargs):
       supstage_object=self.get_object()
       data=request.data
       supstage_object.stage_id=data.get("stage",supstage_object.stage)
       supstage_object.superviser_id=data.get("superviser",supstage_object.superviser)
       supstage_object.is_admin=data.get("is_admin",supstage_object.is_admin)
       if(supstage_object.is_admin=="true"): 
          supstage_object.is_admin=True
       if(supstage_object.is_admin=="false"):
          supstage_object.is_admin=False
       supstage_object.save()
       serializer=StageSerializer(supstage_object)
       return Response(serializer.data)

    @action(detail=False,methods=('get','post','put','delete','patch'))
    #get all supstage
    def get_all(self,request):
      if(request.method=='GET'):
        queryset=self.get_filtered_queryset()
        serializer=self.get_serializer(queryset,many=True)
        return Response(serializer.data)
      #post method
      if (request.method=='POST'):
        print("data=",request.data)
        serializer=self.get_serializer(data=request.data)
        if(serializer.is_valid()):
           serializer.save()
           return Response(serializer.data)
        else:
           return Response(serializer.errors)

class stage_stagiaireViewSet(viewsets.ModelViewSet):
    queryset=stage_stagiaire.objects.order_by("Annee_etude").order_by("id").reverse()
    serializer_class=join_project_stagierSerializer
    filter_backends=(DjangoFilterBackend,)
    filterset_class=stage_stagiairefilter
    pagination_class=StandardResultsSetPagination
    parser_classes=[MultiPartParser,FormParser,JSONParser]
    http_method_names = [ 'get','head']
      #filter actions
    def get_filtered_queryset(self):
        queryset = stage_stagiaire.objects.all()
        filterset = self.filterset_class(self.request.GET, queryset=queryset)
        if filterset.is_valid():
            return filterset.qs
        return queryset
    #filter certified only
    def get_filtered_queryset_certified(self):
        queryset = stage_stagiaire.objects.filter(Certified=False)
        filterset = self.filterset_class(self.request.GET, queryset=queryset)
      #   pagination=self.pagination_class(self.request.GET,queryset=queryset)
        if filterset.is_valid():
            return filterset.qs
        return queryset
      #get method for certified only
   #  def list(self,request):
   #    queryset=self.get_filtered_queryset_certified()
   #    page = self.paginate_queryset(queryset)
   #    if page is not None:
   #          serializer = join_project_stagierSerializer(page, many=True)
   #          return self.get_paginated_response(serializer.data)
   #    else:
   #           serializer = join_project_stagierSerializer(queryset, many=True)
   #           return Response(serializer.data)
    #delete method
    def destroy(self, request, pk=None, *args, **kwargs):
        instance = self.get_object()
        # you custom logic #
        return super(stage_stagiaireViewSet, self).destroy(request, pk, *args, **kwargs)
    #patch method
    def partial_update(self, request, *args, **kwargs):
       stage_stagiaire_object=self.get_object()
       data=request.data
       stage_stagiaire.stage_id=data.get("stage",stage_stagiaire.stage)
       stage_stagiaire.stagiaire_id=data.get("stagiaire",stage_stagiaire.stagiaire)
       stage_stagiaire_object.Certified=data.get("Certified",stage_stagiaire_object.Certified)
       if(stage_stagiaire_object.Certified=="true"): 
          stage_stagiaire_object.Certified=True
       if(stage_stagiaire_object.Certified=="false"):
          stage_stagiaire_object.Certified=False
       stage_stagiaire_object.Code=data.get("Code",stage_stagiaire_object.Code)
       stage_stagiaire_object.Rapport=data.get("Rapport",stage_stagiaire_object.Rapport)
       stage_stagiaire_object.Presentation=data.get("Presentation",stage_stagiaire_object.Presentation)
       stage_stagiaire_object.PDF_Agreement=data.get("PDF_Agreement",stage_stagiaire_object.PDF_Agreement)
       stage_stagiaire_object.PDF_Prolongement=data.get("PDF_Prolongement",stage_stagiaire_object.PDF_Prolongement)
       stage_stagiaire_object.PDF_Certificate=data.get("PDF_Certificate",stage_stagiaire_object.PDF_Certificate)
       stage_stagiaire_object.save()
      #  serializer=StageSerializer(stage_stagiaire_object)
       serializer=join_project_stagierSerializer(stage_stagiaire_object)
       return Response(serializer.data)
    
    @action(detail=False,methods=('get','post','put','delete','patch'))
    #get all supstage
    def get_all(self,request):
      if(request.method=='GET'):
        queryset=self.get_filtered_queryset()
        serializer=self.get_serializer(queryset,many=True)
        return Response(serializer.data)
      #post method
      if (request.method=='POST'):
        print("data=",request.data)
        serializer=self.get_serializer(data=request.data)
        if(serializer.is_valid()):
           serializer.save()
           return Response(serializer.data)
        else:
           return Response(serializer.errors)
    @action(detail=False,methods=('get','post','put','delete','patch'))    
    def get_notcertified(self,request):
       if(request.method=='GET'):
          queryset=self.get_filtered_queryset_certified() 
          serializer=self.get_serializer(queryset,many=True)
          return Response(serializer.data)
       
class StagiaireViewSet(viewsets.ModelViewSet):
    queryset = Stagiaire.objects.all()
    serializer_class = StagiaireSerializer
    pagination_class= StandardResultsSetPagination
    @action(detail=False,methods=('get','post','put','delete','patch'))
    #get all supstage
    def get_all(self,request):
      if(request.method=='GET'):
         queryset=Stagiaire.objects.all()
         serializer = self.get_serializer(queryset, many=True)
         return Response(serializer.data)
      if (request.method=='POST'):
        print("data=",request.data)
        serializer=self.get_serializer(data=request.data)
        if(serializer.is_valid()):
           serializer.save()
           return Response(serializer.data)
        else:
           return Response(serializer.errors)
    #patch method
    def partial_update(self, request, *args, **kwargs):
       stagiaire_object=self.get_object()
       data=request.data
       stagiaire_object.Nom=data.get("Nom",stagiaire_object.Nom)
       stagiaire_object.Prenom=data.get("Prenom",stagiaire_object.Prenom)
       stagiaire_object.Email=data.get("Email",stagiaire_object.Email)
       stagiaire_object.Telephone=data.get("Telephone",stagiaire_object.Telephone)
       stagiaire_object.N_stage=data.get("N_stage",stagiaire_object.N_stage)
       stagiaire_object.save()
       serializer=StagiaireSerializer(stagiaire_object)
       return Response(serializer.data) 

class MembreViewSet(viewsets.ModelViewSet):
    # parser_classes=[MultiPartParser,FormParser,JSONParser]
    queryset = Membre.objects.all().order_by("id").reverse()
    serializer_class = MembreSerializer
    filter_backends=[DjangoFilterBackend,]
    filterset_class=memberfilter
    pagination_class= StandardResultsSetPagination
    http_method_names = ['delete', 'get','post','put','patch','head']
      #filter actions
    def get_filtered_queryset(self):
        queryset = Membre.objects.all().order_by("id").reverse()
        filterset = self.filterset_class(self.request.GET, queryset=queryset)
        if filterset.is_valid():
            return filterset.qs
        return queryset
    #filter supervisers only
    def get_filtered_queryset_superviser(self):
        queryset = Membre.objects.filter(is_sup=False).order_by("id").reverse()
        filterset = self.filterset_class(self.request.GET, queryset=queryset)
        if filterset.is_valid():
            return filterset.qs
        return queryset
      #get method for admin only
    def list(self,request):
      queryset=self.get_filtered_queryset()
      page = self.paginate_queryset(queryset)
      if page is not None:
            serializer = MembreSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
      # else:
      #       serializer = supstageSerializer(queryset, many=True)
      #       return Response(serializer.data, status=status.HTTP_200_OK)
    #delete method
    def destroy(self, request, pk=None, *args, **kwargs):
        instance = self.get_object()
        # you custom logic #
        return super(MembreViewSet, self).destroy(request, pk, *args, **kwargs)
    #patch method
    def partial_update(self, request, *args, **kwargs):
       member_object=self.get_object()
       data=request.data
       member_object.Nom=data.get("Nom",member_object.Nom)
       member_object.Prenom=data.get("Prenom",member_object.Prenom)
       member_object.Nom_pere=data.get("Nom_pere",member_object.Nom_pere)
       member_object.Date_naissance=data.get("Date_naissance",member_object.Date_naissance)
       member_object.Lieu_naissance=data.get("Lieu_naissance",member_object.Lieu_naissance)
       member_object.Telephone=data.get("Telephone",member_object.Telephone)
       member_object.Adresse=data.get("Adresse",member_object.Adresse)
       member_object.Groupe_sanguin=data.get("Groupe_sanguin",member_object.Groupe_sanguin)
       member_object.Travail=data.get("Travail",member_object.Travail)
       member_object.Profession=data.get("Profession",member_object.Profession)
       member_object.Domaine=data.get("Domaine",member_object.Domaine)
       member_object.Email=data.get("Email",member_object.Email)
       member_object.Nom_autre_association=data.get("Nom_autre_association",member_object.Nom_autre_association)
       member_object.Application_PDF=data.get("Application_PDF",member_object.Application_PDF)
       member_object.is_sup=data.get("is_sup",member_object.is_sup)
       if(member_object.is_sup=="true"): 
          member_object.is_sup=True
       if(member_object.is_sup=="false"):
          member_object.is_sup=False
       member_object.Autre_association=data.get("Autre_association",member_object.Autre_association)
       if(member_object.Autre_association=="true"): 
          member_object.Autre_association=True
       if(member_object.Autre_association=="false"):
          member_object.Autre_association=False
       member_object.A_paye=data.get("A_paye",member_object.A_paye)
       if(member_object.A_paye=="true"): 
          member_object.A_paye=True
       if(member_object.A_paye=="false"):
          member_object.A_paye=False
       member_object.save()
       serializer=MembreSerializer(member_object)
       return Response(serializer.data)

    @action(detail=False,methods=('get','post','put','delete','patch'))
    #get all supstage
    def get_all(self,request):
      if(request.method=='GET'):
        queryset=self.get_filtered_queryset()
        serializer=self.get_serializer(queryset,many=True)
        return Response(serializer.data)
      #post method
      if (request.method=='POST'):
        print("data=",request.data)
        serializer=self.get_serializer(data=request.data)
        if(serializer.is_valid()):
           serializer.save()
           return Response(serializer.data)
        else:
           return Response(serializer.errors)
    @action(detail=False,methods=('get','post','put','delete','patch'))    
    def get_superviser(self,request):
       if(request.method=='GET'):
          queryset=self.get_filtered_queryset_superviser() 
          serializer=self.get_serializer(queryset,many=True)
          return Response(serializer.data)
       
class SuperviserViewSet(viewsets.ModelViewSet):
    # parser_classes=[MultiPartParser,FormParser,JSONParser]
    queryset = Superviser.objects.all() .order_by("id").reverse()
    serializer_class = SuperviserSerializer
    pagination_class= StandardResultsSetPagination
    filter_backends=[DjangoFilterBackend,]
    filterset_class=superviserfilter
    @action(detail=False,methods=['get'])
    def get_all(self,request):
     queryset=Superviser.objects.all()
     serializer = self.get_serializer(queryset, many=True)
     return Response(serializer.data)
    #patch method
    def partial_update(self, request, *args, **kwargs):
       superviser_object=self.get_object()
       data=request.data
       superviser_object.Nom=data.get("Nom",superviser_object.Nom)
       superviser_object.Prenom=data.get("Prenom",superviser_object.Prenom)
       superviser_object.Email=data.get("Email",superviser_object.Email)
       superviser_object.Telephone=data.get("Telephone",superviser_object.Telephone)
       superviser_object.Profession=data.get("Profession",superviser_object.Profession)
       superviser_object.Id_Membre=data.get("Id_Membre",superviser_object.Id_Membre)
       superviser_object.save()
       serializer=StagiaireSerializer(superviser_object)
       return Response(serializer.data) 
    
# class DeletesupstageViewSet(viewsets.ModelViewSet):
#     # parser_classes=[MultiPartParser,FormParser,JSONParser]
#     queryset = super_stage.objects.all()
#     serializer_class = supstageSerializer
#     http_method_names = ['delete', ]

#     def destroy(self, request, pk=None, *args, **kwargs):
#         instance = self.get_object()
#         # you custom logic #
#         return super(DeletesupstageViewSet, self).destroy(request, pk, *args, **kwargs)

# @api_view(['GET'])
# def hello_world(request):
#     return Response({'message': 'Hello, world!'})


# @api_view(['GET'])
# def stage(request)
#     stages=Stage.objects.all()
#     return Response({})

# @api_view(['GET'])
# def stage(request)
#     return Response9({''})

# @api_view(['GET'])
# def stage(request)
#     return Response({})

 # queryset = super_stage.objects.all()
    # serializer_class = supstageSerializer
    # @action(detail=False, methods=['get'])
    # def is_Admin(self, request):
    #     queryset = super_stage.objects.filter(is_admin=True)  # Custom queryset for the custom action
    #     serializer = self.get_serializer(queryset, many=True)
    #     return Response(serializer.data)
    # @action(detail=False, methods=['get','post'])
    # def filter(self,request):
        # queryset=super_stage.objects.filter(is_admin=True)
        # serializer=self.get_serializer(queryset,many=True)
        # filter_backends=(DjangoFilterBackend,)
        # filterset=super_stagefilter

      # if (request.method=='PATCH'):
      #    print("data=",request.data)
      #    serializer=self.get_serializer(data=request.data,partial=True)
      #    if(serializer.is_valid()):
      #       serializer.save()
      #       return Response(serializer.data)
      #    else:
      #       return Response(serializer.errors)

   # def destroy(self, request, pk=None):
   #      queryset = super_stage.objects.all()
   #      sup_st = get_object_or_404(queryset, pk=pk)
   #      serializer = supstageSerializer(sup_st)
   #      return Response(serializer.data)