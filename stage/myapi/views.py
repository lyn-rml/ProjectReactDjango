from django.shortcuts import render
from .models import Stage,Stagiaire,Superviser,Membre
from django.db.models import F, Value, CharField
from django.db.models.functions import Concat
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
from django.views.generic import ListView
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'


class StageViewSet(viewsets.ModelViewSet):
    queryset = Stage.objects.order_by('pk')
    serializer_class = StageSerializer
    filter_backends=(DjangoFilterBackend,)
    filterset_class = StageFilter
    pagination_class= StandardResultsSetPagination
    http_method_names = ['delete', 'get', 'post', 'put', 'patch', 'head']

    def partial_update(self, request, *args, **kwargs):
        stage_object = self.get_object()
        data = request.data

        # Mise à jour des champs existants
        for field in ['Title', 'Domain', 'Speciality', 'PDF_sujet', 'Date_register']:
            setattr(stage_object, field, data.get(field, getattr(stage_object, field)))

        # Gestion spéciale de `Sujet_pris`
        sujet_pris = data.get("Sujet_pris", stage_object.Sujet_pris)
        stage_object.Sujet_pris = sujet_pris.lower() == "true" if isinstance(sujet_pris, str) else sujet_pris
        
        stage_object.save()
        serializer = StageSerializer(stage_object)
        return Response(serializer.data)
    
    def list(self, request, *args, **kwargs):  
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Cette méthode remplace `POST` dans `get_all` pour créer un stage.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class sup_stageViewSet(viewsets.ModelViewSet):
    queryset=super_stage.objects.all().order_by('id')
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
        queryset = super_stage.objects.filter(is_admin=True)
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
    def create(self, request, *args, **kwargs):
        print("Data received:", request.data)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=False, methods=['get'])
    def get_all(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class stage_stagiaireViewSet(viewsets.ModelViewSet):
    queryset = stage_stagiaire.objects.select_related('stagiaire', 'stage').order_by("-id", "Annee_etude")
    serializer_class = join_project_stagierSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = stage_stagiairefilter
    pagination_class = StandardResultsSetPagination
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    http_method_names = ['get', 'post', 'patch', 'delete', 'head']

    def get_filtered_queryset(self):
        queryset = stage_stagiaire.objects.all()
        filterset = self.filterset_class(self.request.GET, queryset=queryset)
        return filterset.qs if filterset.is_valid() else queryset

    def get_filtered_queryset_certified(self):
        queryset = stage_stagiaire.objects.filter(Certified=False)
        filterset = self.filterset_class(self.request.GET, queryset=queryset)
        return filterset.qs if filterset.is_valid() else queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def perform_create(self, serializer):
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data

        instance.Certified = data.get("Certified", instance.Certified)
        instance.Certified = str(instance.Certified).lower() == "true"

        instance.stage_id = data.get("stage", instance.stage_id)
        instance.stagiaire_id = data.get("stagiaire", instance.stagiaire_id)
        instance.Code = data.get("Code", instance.Code)
        instance.Rapport = data.get("Rapport", instance.Rapport)
        instance.Presentation = data.get("Presentation", instance.Presentation)
        instance.PDF_Agreement = data.get("PDF_Agreement", instance.PDF_Agreement)
        instance.PDF_Prolongement = data.get("PDF_Prolongement", instance.PDF_Prolongement)
        instance.PDF_Certificate = data.get("PDF_Certificate", instance.PDF_Certificate)

        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def get_all(self, request):
        queryset = self.get_filtered_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def get_notcertified(self, request):
        queryset = self.get_filtered_queryset_certified()
        serializer = self.get_serializer(queryset, many=True)
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
        member_object = self.get_object()
        data = request.data
    
    # Update fields from request data
        member_object.Nom = data.get("Nom", member_object.Nom)
        member_object.Prenom = data.get("Prenom", member_object.Prenom)
        member_object.Nom_pere = data.get("Nom_pere", member_object.Nom_pere)
        member_object.Date_naissance = data.get("Date_naissance", member_object.Date_naissance)
        member_object.Lieu_naissance = data.get("Lieu_naissance", member_object.Lieu_naissance)
        member_object.Telephone = data.get("Telephone", member_object.Telephone)
        member_object.Adresse = data.get("Adresse", member_object.Adresse)
        member_object.Groupe_sanguin = data.get("Groupe_sanguin", member_object.Groupe_sanguin)
        member_object.Travail = data.get("Travail", member_object.Travail)
        member_object.Profession = data.get("Profession", member_object.Profession)
        member_object.Domaine = data.get("Domaine", member_object.Domaine)
        member_object.Email = data.get("Email", member_object.Email)
        member_object.Nom_autre_association = data.get("Nom_autre_association", member_object.Nom_autre_association)
        member_object.Application_PDF = data.get("Application_PDF", member_object.Application_PDF)

    # Handle boolean values
        member_object.is_sup = data.get("is_sup", member_object.is_sup)

    # Convert to boolean if needed
        if isinstance(member_object.is_sup, str):
            if member_object.is_sup.lower() == "true":
                member_object.is_sup = True
            elif member_object.is_sup.lower() == "false":
                member_object.is_sup = False
    
    # Handle other boolean fields
        member_object.Autre_association = data.get("Autre_association", member_object.Autre_association)
        if isinstance(member_object.Autre_association, str):
            if member_object.Autre_association.lower() == "true":
                member_object.Autre_association = True
            elif member_object.Autre_association.lower() == "false":
                member_object.Autre_association = False

        member_object.A_paye = data.get("A_paye", member_object.A_paye)
        if isinstance(member_object.A_paye, str):
            if member_object.A_paye.lower() == "true":
                member_object.A_paye = True
            elif member_object.A_paye.lower() == "false":
                member_object.A_paye = False

        member_object.save()
        serializer = MembreSerializer(member_object)
        return Response(serializer.data)
  #
    
    @action(detail=False,methods=('get','post','put','delete','patch'))
    #get all supstage
    def get_all(self,request):
      if(request.method=='GET'):
        queryset=self.get_filtered_queryset()
        serializer=self.get_serializer(queryset,many=True)
        return Response(serializer.data)
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
    @action(detail=False, methods=['get'])
    def get_all(self, request):
        queryset = Superviser.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        # Extract the supervisor data from the request
        data = request.data
        
        superviser_data = {
            "Nom": data.get("Nom"),
            "Prenom": data.get("Prenom"),
            "Telephone": data.get("Telephone"),
            "Profession": data.get("Profession"),
            "Email": data.get("Email"),
            "Id_Membre": data.get("Id_Membre", 0),  # Default to 0 if no member ID is provided
        }

        # Serialize the data
        serializer = self.get_serializer(data=superviser_data)
        
        if serializer.is_valid():
            # Save the new supervisor
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        superviser_object = self.get_object()
        data = request.data
        superviser_object.Nom = data.get("Nom", superviser_object.Nom)
        superviser_object.Prenom = data.get("Prenom", superviser_object.Prenom)
        superviser_object.Email = data.get("Email", superviser_object.Email)
        superviser_object.Telephone = data.get("Telephone", superviser_object.Telephone)
        superviser_object.Profession = data.get("Profession", superviser_object.Profession)
        superviser_object.Id_Membre = data.get("Id_Membre", superviser_object.Id_Membre)

        if "Id_Membre" in data:  # Explicitly check if Id_Membre is present
             print("Updating Id_Membre:", data["Id_Membre"])
             superviser_object.Id_Membre = data["Id_Membre"]

        superviser_object.save()
        serializer = self.get_serializer(superviser_object)
        return Response(serializer.data)
    
