
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
    filterset_class = InternSerializer
   


class SuperviserViewSet(viewsets.ModelViewSet):
    # parser_classes=[MultiPartParser,FormParser,JSONParser]
    queryset = Supervisor.objects.all() .order_by("id").reverse()
    serializer_class = SupervisorSerializer
    pagination_class= StandardResultsSetPagination
    filter_backends=[DjangoFilterBackend,]
    filterset_class=supervisorfilter
  
    
