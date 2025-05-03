
from django.http import JsonResponse
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
from django.db.models import OuterRef, Subquery
from django.db import connection, transaction
from django.db import IntegrityError
from django.db.models import Count

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    user = request.user
    return Response({
        'username': user.username,
        'type_of_user': user.role,
    })

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    
        
class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all().order_by("-id")  # Adjusted for descending order
    serializer_class = MemberSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = memberfilter  # Filter class for Member (make sure it's defined)
    pagination_class = StandardResultsSetPagination  # Custom pagination class

    def get_queryset(self):
        qs = super().get_queryset()

        # Subquery to get the latest payment status
        latest_payment = Payment_history.objects.filter(
            Id_Membre=OuterRef('pk')
        ).order_by('-Payment_date')

        qs = qs.annotate(
            latest_payment_payed=Subquery(latest_payment.values('payed')[:1])
        )

        return qs
    @action(detail=False, methods=['get'])
    def members_as_supervisor(self, request):
        """
        Get all members who are linked as supervisors
        """
        members_as_supervisor = Member.objects.filter(supervisor__isnull=False)
        serializer = self.get_serializer(members_as_supervisor, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def members_not_supervisor(self, request):
        """
        Get all members who are not linked as supervisors
        """
        members_not_supervisor = Member.objects.filter(supervisor__isnull=True)
        serializer = self.get_serializer(members_not_supervisor, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)    

    @action(detail=False, methods=['post'])
    def create_member_from_supervisor(self, request):
     supervisor_id = request.data.get('supervisor_id')

    # Get other fields from request data
     father_name = request.data.get('Father_name')
     date_of_birth = request.data.get('Date_of_birth')
     place_of_birth = request.data.get('Place_of_birth')
     adresse = request.data.get('Adresse')
     blood_type = request.data.get('Blood_type')
     work = request.data.get('Work')
     domaine = request.data.get('Domaine')
     is_another_association = str(request.data.get('is_another_association', 'false')).lower() == 'true'
     association_name = request.data.get('association_name')

     if not all([supervisor_id, father_name, date_of_birth, place_of_birth, adresse, blood_type, work, domaine]):
        return Response({"error": "Required fields missing"}, status=status.HTTP_400_BAD_REQUEST)

     try:
        supervisor = Supervisor.objects.get(id=supervisor_id)
     except Supervisor.DoesNotExist:
        return Response({"error": "Supervisor not found"}, status=status.HTTP_404_NOT_FOUND)

     try:
        with transaction.atomic():
            # Use the same person ID
            member = Member.objects.create(
                id=supervisor.id,  # <-- Very important: use same Person ID
                Father_name=father_name,
                Date_of_birth=date_of_birth,
                Place_of_birth=place_of_birth,
                Adresse=adresse,
                Blood_type=blood_type,
                Work=work,
                Domaine=domaine,
                is_another_association=is_another_association,
                association_name=association_name if association_name else "",
            )

            # Link supervisor to this member
            supervisor.Id_Membre = member
            supervisor.save()

     except IntegrityError:
        return Response({"error": "Member already exists for this supervisor."}, status=status.HTTP_400_BAD_REQUEST)

     return Response({"message": "Member created from Supervisor successfully", "member_id": member.id}, status=status.HTTP_201_CREATED)
    @action(detail=True, methods=['delete'], url_path='delete-member-role')
    def delete_member_only(self, request, pk=None):
     try:
        member = Member.objects.get(pk=pk)
        
        # Remove the FK reference from Supervisor to this member
        Supervisor.objects.filter(Id_Membre=member).update(Id_Membre=None)
        
        # Now remove ONLY the row from Member table without touching Person
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM myapi_member WHERE person_ptr_id = %s", [member.pk])

        return Response({"detail": "Member role removed successfully."}, status=status.HTTP_204_NO_CONTENT)
    
     except Member.DoesNotExist:
        return Response({"error": "Member not found."}, status=status.HTTP_404_NOT_FOUND)
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.order_by('pk')
    serializer_class = ProjectSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ProjectFilter  # Ensure this is defined
    pagination_class = StandardResultsSetPagination  # Ensure this is set correctly

    # Custom action to get interns for a project
    @action(detail=True, methods=['get'])
    def get_intern(self, request, pk=None):
        project = self.get_object()  # Retrieve the project using the primary key (pk)
        internships = Internship.objects.filter(Project_id=project)  # Fetch internships related to this project
        intern_ids = [internship.intern_id.id for internship in internships]
        return Response(intern_ids, status=status.HTTP_200_OK)

    # Custom action to get supervisors for a project
    @action(detail=True, methods=['get'])
    def get_supervisor(self, request, pk=None):
        project = self.get_object()  # Retrieve the project using the primary key (pk)
        supervisors_stages = supervisor_internship.objects.filter(project_id=project)  # Get related supervisors
        supervisor_ids = [ss.supervisor_id.id for ss in supervisors_stages]
        return Response(supervisor_ids, status=status.HTTP_200_OK)
    @action(detail=False, methods=['get'])
    def with_interns(self, request):
        # Get all project IDs that have at least one intern
        project_ids_with_interns = Internship.objects.values_list('Project_id', flat=True).distinct()
        
        # Filter projects using those IDs
        projects = self.get_queryset().filter(id__in=project_ids_with_interns)

        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)
    

class supervisor_internshipViewSet(viewsets.ModelViewSet):
    queryset = supervisor_internship.objects.all().order_by('id')
    serializer_class =  SupervisorInternshipSerializer
    filter_backends = (DjangoFilterBackend,)  # Enable filtering backend
    filterset_class =SupervisorInternshipFilter # Assign the filter class
    pagination_class = StandardResultsSetPagination
    @action(detail=False, methods=['get'], url_path='main-supervisors')
    def get_main_supervisors(self, request):
        # Filter the supervisors where Role is 'Admin'
        main_supervisors = supervisor_internship.objects.filter(Role='Admin')
        serializer =  SupervisorInternshipSerializer(main_supervisors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Custom action to get other supervisors (Other role)
    @action(detail=False, methods=['get'], url_path='other-supervisors')
    def get_other_supervisors(self, request):
        # Filter the supervisors where Role is 'Other'
        other_supervisors = supervisor_internship.objects.filter(Role='Other')
        serializer =  SupervisorInternshipSerializer(other_supervisors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class internshipViewSet(viewsets.ModelViewSet):
    queryset = Internship.objects.all().order_by("-id")
    serializer_class =InternshipSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = stage_stagiairefilter
    pagination_class = StandardResultsSetPagination
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    @action(detail=True, methods=['get'], url_path='projects')
    def get_projects_for_intern(self, request, pk=None):
        # Filter internships by the intern's ID (using the pk in the URL)
        internships = Internship.objects.filter(intern_id=pk)  # pk is the intern's ID
        serializer =InternshipSerializer(internships, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
       
class StagiaireViewSet(viewsets.ModelViewSet):
    queryset = Intern.objects.all()
    serializer_class = InternSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = internFilter
   


class SuperviserViewSet(viewsets.ModelViewSet):
    # parser_classes=[MultiPartParser,FormParser,JSONParser]
    queryset = Supervisor.objects.all() .order_by("id").reverse()
    serializer_class = SupervisorSerializer
    pagination_class= StandardResultsSetPagination
    filter_backends=[DjangoFilterBackend,]
    filterset_class=supervisorfilter
    @action(detail=False, methods=['post'])
    def create_supervisor_from_member(self, request):
        member_id = request.data.get('member_id')

        if not member_id:
            return Response({"error": "member_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Check if the Member exists
            member = Member.objects.get(id=member_id)
        except Member.DoesNotExist:
            return Response({"error": "Member not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            with transaction.atomic():
                # Create a Supervisor using the same Person ID
                supervisor = Supervisor.objects.create(
                    id=member.id,  # Important: use the same id from Person inheritance
                    Id_Membre=member  # Link the supervisor to the member
                )
            supervisor.first_name = member.first_name
            supervisor.last_name = member.last_name
            supervisor.email = member.email
            supervisor.phone_number = member.phone_number
            supervisor.save()
            
        except IntegrityError:
            return Response({"error": "Supervisor already exists for this member."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Supervisor created from Member successfully.", "supervisor_id": supervisor.id}, status=status.HTTP_201_CREATED)
    @action(detail=False, methods=['post'])
    def create_supervisor_from_member(self, request):
        member_id = request.data.get('member_id')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        phone_number = request.data.get('phone_number')
        email = request.data.get('email')
        profession = request.data.get('profession')

        if not all([member_id, first_name, last_name, phone_number, email, profession]):
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            member = Member.objects.get(id=member_id)
        except Member.DoesNotExist:
            return Response({"error": "Member not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            with transaction.atomic():
                supervisor = Supervisor.objects.create(
                    id=member.id,  # Link to same Person
                    first_name=first_name,
                    last_name=last_name,
                    phone_number=phone_number,
                    email=email,
                    profession=profession,
                    Id_Membre=member,
                )
        except IntegrityError:
            return Response({"error": "Supervisor already exists for this member."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Supervisor created from member successfully", "supervisor_id": supervisor.id}, status=status.HTTP_201_CREATED)
    @action(detail=True, methods=['delete'], url_path='delete-superviser-role')
    def delete_superviser_only(self, request, pk=None):
        try:
            # Retrieve the supervisor to be deleted
            supervisor = Supervisor.objects.get(pk=pk)
            
            # First, delete any related supervisor_internship records using raw SQL
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM myapi_supervisor_internship WHERE supervisor_id_id = %s", [supervisor.pk])

            # Now delete the supervisor record
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM myapi_supervisor WHERE person_ptr_id = %s", [supervisor.pk])

            return Response({"detail": "Supervisor role and related internships removed successfully."}, status=status.HTTP_204_NO_CONTENT)
        
        except Supervisor.DoesNotExist:
            return Response({"error": "Supervisor not found."}, status=status.HTTP_404_NOT_FOUND)

class PaymentHistoryViewSet(viewsets.ModelViewSet):
    queryset = Payment_history.objects.all()
    serializer_class = PaymentHistorySerializer
    @action(detail=False, methods=['get'], url_path='payed')
    def get_payed(self, request):
        payed_records = self.queryset.filter(payed=True)
        serializer = self.get_serializer(payed_records, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='unpayed')
    def get_unpayed(self, request):
        unpayed_records = self.queryset.filter(payed=False)
        serializer = self.get_serializer(unpayed_records, many=True)
        return Response(serializer.data)
    
