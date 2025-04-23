
from .models import *
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser,JSONParser,FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework import viewsets
from .serializers import *
from .filters import *
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import  UserSerializer



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    user = request.user
    serializer =  UserSerializer(user)
    return Response(serializer.data)
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'

class PersonViewSet(viewsets.ModelViewSet):
    queryset = person.objects.all()
    serializer_class = PersonSerializer
class MembreViewSet(viewsets.ModelViewSet):
    # parser_classes=[MultiPartParser,FormParser,JSONParser]
    queryset = Member.objects.all().order_by("id").reverse()
    serializer_class = MemberSerializer
    filter_backends=[DjangoFilterBackend,]
    filterset_class=memberfilter
    pagination_class= StandardResultsSetPagination
    http_method_names = ['delete', 'get','post','put','patch','head']
    parser_classes = [MultiPartParser, FormParser]
    def create(self, request, *args, **kwargs):
     data = request.data.copy()
     person_data = data.pop('person', None)

     if person_data:
        person_obj = person.objects.create(**person_data)
        data['person_id'] = person_obj.id  # ✅ utiliser 'person_id', le vrai nom du champ

     serializer = self.get_serializer(data=data)
     serializer.is_valid(raise_exception=True)
     self.perform_create(serializer)
     headers = self.get_success_headers(serializer.data)
     return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    def get_filtered_queryset(self):
        queryset = Member.objects.all().order_by("id").reverse()
        filterset = self.filterset_class(self.request.GET, queryset=queryset)
        if filterset.is_valid():
            return filterset.qs
        return queryset
    #filter supervisers only
    def get_filtered_queryset_superviser(self):
        queryset = Member.objects.filter(is_sup=False).order_by("id").reverse()
        filterset = self.filterset_class(self.request.GET, queryset=queryset)
        if filterset.is_valid():
            return filterset.qs
        return queryset
      #get method for admin only
    def list(self,request):
      queryset = Member.objects.select_related('person_id').all()
      page = self.paginate_queryset(queryset)
      if page is not None:
            serializer = MemberSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
    def destroy(self, request, pk=None, *args, **kwargs):
        instance = self.get_object()
        # you custom logic #
        return super(MembreViewSet, self).destroy(request, pk, *args, **kwargs)
       #patch method
    def partial_update(self, request, *args, **kwargs):
     member_object = self.get_object()
     person_object = member_object.person_id
     data = request.data
    # Update person fields
     person_object.first_name = data.get("first_name", person_object.first_name)
     person_object.last_name = data.get("last_name", person_object.last_name)
     person_object.email = data.get("email", person_object.email)
     person_object.telephone_number = data.get("telephone_number", person_object.telephone_number)
     person_object.profession = data.get("profession", person_object.profession)
     person_object.save()
    # Update member fields
     member_object.Father_name = data.get("Father_name", member_object.Father_name)
     member_object.Date_of_birth = data.get("Date_of_birth", member_object.Date_of_birth)
     member_object.Place_of_birth = data.get("Place_of_birth", member_object.Place_of_birth)
     member_object.Adresse = data.get("Adresse", member_object.Adresse)
     member_object.Blood_type = data.get("Blood_type", member_object.Blood_type)
     member_object.Work = data.get("Work", member_object.Work)
     member_object.Domaine = data.get("Domaine", member_object.Domaine)
     member_object.association_name = data.get("association_name", member_object.association_name)
    # Booleans
     for field in ['is_sup', 'is_another_association', 'A_paye']:
        value = data.get(field, getattr(member_object, field))
        if isinstance(value, str):
            value = value.lower() == "true"
        setattr(member_object, field, value)
    # Handle file upload
     if 'Application_PDF' in request.FILES:
        member_object.Application_PDF = request.FILES['Application_PDF']
     member_object.save()
     serializer = self.get_serializer(member_object)
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
       
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.order_by('pk')
    serializer_class = ProjectSerializer
    filter_backends=(DjangoFilterBackend,)
    filterset_class = ProjectFilter
    pagination_class= StandardResultsSetPagination
    http_method_names = ['delete', 'get', 'post', 'put', 'patch', 'head']

    def partial_update(self, request, *args, **kwargs):
        stage_object = self.get_object()
        data = request.data

        # Mise à jour des champs existants
        for field in ['Title', 'Domain', 'Speciality', ' PDF_subject', 'Date_register']:
            setattr(stage_object, field, data.get(field, getattr(stage_object, field)))

        # Gestion spéciale de `Sujet_pris`
        sujet_pris = data.get("is_taken", stage_object.Sujet_pris)
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
       
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class supervisor_internshipViewSet(viewsets.ModelViewSet):
    queryset = supervisor_internship.objects.all().order_by('id')
    serializer_class = SupervisorInternshipSerializer
    filter_backends = (DjangoFilterBackend,)  # Enable filtering backend
    filterset_class =SupervisorInternshipFilter # Assign the filter class
    pagination_class = StandardResultsSetPagination
    http_method_names = ['delete', 'get', 'post', 'put', 'patch', 'head']

    # Override the list method to return all records with filters applied if present
    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())  # Apply filtering
        page = self.paginate_queryset(queryset)  # Apply pagination if needed
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    # Delete method
    def destroy(self, request, pk=None, *args, **kwargs):
        instance = self.get_object()
        # Custom logic if needed
        return super(sup_stageViewSet, self).destroy(request, pk, *args, **kwargs)

    # Patch method
    def partial_update(self, request, *args, **kwargs):
        supstage_object = self.get_object()
        data = request.data
        supstage_object.project_id = data.get("project", supstage_object.Project_id)
        supstage_object.supervisor_id = data.get("supervisor", supstage_object.supervisor_id)
        supstage_object.is_admin = data.get("is_admin", supstage_object.is_admin)
        if supstage_object.is_admin == "true":
            supstage_object.is_admin = True
        if supstage_object.is_admin == "false":
            supstage_object.is_admin = False
        supstage_object.save()
        serializer = supstageSerializer(supstage_object)
        return Response(serializer.data)

    # Create method
    def create(self, request, *args, **kwargs):
        print("Data received:", request.data)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class internshipViewSet(viewsets.ModelViewSet):
    queryset = Internship.objects.select_related('Intern', 'Project').order_by("-id", "Project_year")
    serializer_class =InternshipSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = stage_stagiairefilter
    pagination_class = StandardResultsSetPagination
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    http_method_names = ['get', 'post', 'patch', 'delete', 'head']

    def get_filtered_queryset(self):
        queryset = InternshipSerializer.objects.all()
        filterset = self.filterset_class(self.request.GET, queryset=queryset)
        return filterset.qs if filterset.is_valid() else queryset

    def get_filtered_queryset_certified(self):
        queryset = Internship.objects.filter(Certified=False)
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

    # Update the fields from the request data (with default values if not provided)
        instance.intern_id = data.get("Intern", instance.intern_id)
        instance.Project_id = data.get("Project", instance.Project_id)
        instance.University = data.get("Universite", instance.Universite)
        instance.Promotion = data.get("Promotion", instance.Promotion)
        instance.Year_of_study = data.get("Annee_etude", instance.Annee_etude)
        instance.Project_year = data.get("Annee", instance.Annee)
        instance.Start_Date = data.get("Date_debut", instance.Date_debut)
        instance.End_Date= data.get("Date_fin", instance.Date_fin)
        instance.Certified = data.get("Certified", instance.Certified)
        instance.PDF_Agreement = data.get("PDF_Agreement", instance.PDF_Agreement)
        instance.PDF_Prolongement = data.get("PDF_Prolongement", instance.PDF_Prolongement)
        instance.PDF_Certified = data.get("PDF_Certificate", instance.PDF_Certificate)
        instance.Code_file = data.get("Code", instance.Code)
        instance.Report_PDF= data.get("Rapport", instance.Rapport)
        instance.Presentation_PDF = data.get("Presentation", instance.Presentation)
        instance.save()

    # Return the updated instance serialized data
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
    queryset = Intern.objects.all()
    serializer_class = InternSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = InternSerializer
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    # Cette méthode permet de gérer GET et POST, mais on préfère maintenant utiliser list() et create()
    @action(detail=False, methods=['get', 'post'])
    def get_all(self, request):
        if request.method == 'GET':
            queryset = self.filter_queryset(self.get_queryset())  # prend en compte les filtres
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)

    # PATCH method personnalisé
    def partial_update(self, request, *args, **kwargs):
     stagiaire = self.get_object()
     person_object = member_object.person_id
     data = request.data

     person_object.first_name = data.get("first_name", person_object.first_name)
     person_object.last_name = data.get("last_name", person_object.last_name)
     person_object.email = data.get("email", person_object.email)
     person_object.telephone_number = data.get("telephone_number", person_object.telephone_number)
     person_object.profession = data.get("profession", person_object.profession)
     person_object.save()

    # Met à jour le champ ManyToMany correctement
     stagiaire.available= data.get("available", stagiaire.available)
     stagiaire.save()
     serializer = StagiaireSerializer(stagiaire)
     return Response(serializer.data)


class SuperviserViewSet(viewsets.ModelViewSet):
    # parser_classes=[MultiPartParser,FormParser,JSONParser]
    queryset = Supervisor.objects.all() .order_by("id").reverse()
    serializer_class = SupervisorSerializer
    pagination_class= StandardResultsSetPagination
    filter_backends=[DjangoFilterBackend,]
    filterset_class=supervisorfilter
    @action(detail=False, methods=['get'])
    def get_all(self, request):
        queryset = Supervisor.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
     data = request.data

    # First, create or get the person instance
     person_instance = person.objects.create(
        first_name=data.get("Prenom"),
        last_name=data.get("Nom"),
        phone_number=data.get("Telephone"),
        profession=data.get("Profession"),
        email=data.get("Email"),
    )

    # Now, create the Supervisor linked to this person
     supervisor = Supervisor.objects.create(
        person_id=person_instance,
        Id_Membre=data.get("Id_Membre", 0)
    )

    # Serialize and return the supervisor
     serializer = self.get_serializer(supervisor)
     return Response(serializer.data, status=status.HTTP_201_CREATED)


    def partial_update(self, request, *args, **kwargs):
     supervisor = self.get_object()
     data = request.data

    # Update the linked person
     person_instance = supervisor.person_id
     person_instance.first_name = data.get("Prenom", person_instance.first_name)
     person_instance.last_name = data.get("Nom", person_instance.last_name)
     person_instance.phone_number = data.get("Telephone", person_instance.phone_number)
     person_instance.profession = data.get("Profession", person_instance.profession)
     person_instance.email = data.get("Email", person_instance.email)
     person_instance.save()
 
    # Update supervisor fields
     if "Id_Membre" in data:
        supervisor.Id_Membre = data["Id_Membre"]

     supervisor.save()

     serializer = self.get_serializer(supervisor)
     return Response(serializer.data)
 
    
