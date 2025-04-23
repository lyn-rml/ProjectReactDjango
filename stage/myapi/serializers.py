from rest_framework import serializers
from .models import Project
from .models import Intern
from .models import Supervisor
from .models import Member
from .models import supervisor_internship
from .models import Internship
from .models import CustomUser
from .models import person
from django.db.models.signals import post_save
from django.contrib.auth.models import Permission
from django.dispatch import receiver



class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = person
        fields = '__all__' 
    def validate_email(self, value):
        if self.instance:
            if person.objects.exclude(pk=self.instance.pk).filter(email=value).exists():
                raise serializers.ValidationError("This email already exists.")
        else:
            if person.objects.filter(email=value).exists():
                raise serializers.ValidationError("This email already exists.")
        return value      
class UserSerializer(serializers.ModelSerializer):
   
     class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'type_of_user','is_active'] 

class MemberSerializer(serializers.ModelSerializer):
    person_details = PersonSerializer(source='person', read_only=True)
    person_data = PersonSerializer(source='person', write_only=True)
    is_superviser = serializers.SerializerMethodField()
    class Meta:
        model = Member
        fields = (
            'person_details',
             'person_data',
            'Father_name',
            'Date_of_birth',
            'Place_of_birth',
            'Adresse',
            'Blood_type',
            'Work',
            'Domaine',
            'is_another_association',
            'association_name',
            'Application_PDF',
            'is_superviser',
        )
    def get_is_superviser(self, obj):
        return Supervisor.objects.filter(Id_Membre=obj).exists()
    
    def create(self, validated_data):
        person_data = validated_data.pop('person')
        person_obj = person.objects.create(**person_data)
        validated_data['person'] = person_obj
        return Member.objects.create(**validated_data)

    def update(self, instance, validated_data):
        person_data = validated_data.pop('person_data', None)
        if person_data:
            person_instance = instance.person_id
            for attr, value in person_data.items():
                setattr(person_instance, attr, value)
            person_instance.save()
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    


class ProjectSerializer(serializers.ModelSerializer):
    interns = serializers.SerializerMethodField()
    has_interns = serializers.SerializerMethodField()
    # Supervisers=SuperviserSerializer(many=True)
    class Meta:
        model = Project
        fields = '__all__'
    def get_interns(self, obj):
        internships = Internship.objects.filter(Project_id=obj)
        return [internship.intern_id.id for internship in internships]

    def get_has_interns(self, obj):
        return Internship.objects.filter(Project_id=obj).exists()   
    def create(self, validated_data):
        return Project.objects.create(**validated_data)
    def update(self, instance, validated_data):
        # Met à jour les champs existants
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
class SupervisorSerializer(serializers.ModelSerializer):
    person_details = PersonSerializer(source='person', read_only=True)
    class Meta:
        model = Supervisor
        fields= ('person_details','id','person_id','Id_Membre')  
    def create(self, validated_data):
        return Supervisor.objects.create(**validated_data)
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)  
        instance.save()
        return instance  

class SupervisorInternshipSerializer(serializers.ModelSerializer):
    project_title = serializers.StringRelatedField(source="project_id.Title")
    supervisor_name = serializers.StringRelatedField(source="supervisor_id")

    class Meta:
        model = supervisor_internship
        fields = ('id', 'supervisor_id', 'project_id', 'Role', 'project_title', 'supervisor_name')

    def create(self, validated_data):
        print("Validated data:", validated_data)
        return supervisor_internship.objects.create(**validated_data)

    def update(self, instance, validated_data):
        print("Validated data:", validated_data)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
class InternSerializer(serializers.ModelSerializer):
    projects = serializers.SerializerMethodField()
    has_projects = serializers.SerializerMethodField()
    person_details = PersonSerializer(source='person', read_only=True)
    class Meta:
        model = Intern
        fields =('projects', 'has_projects','person_details','id','person_id','Id_Membre','available')

    def get_projects(self, obj):
        internships = Internship.objects.filter(intern_id=obj)
        projects = [intern.Project_id for intern in internships]
        return ProjectSerializer(projects, many=True).data

    def get_has_projects(self, obj):
        return Internship.objects.filter(intern_id=obj).exists()

    def create(self, validated_data):
        return Intern.objects.create(**validated_data)

    def update(self, instance, validated_data):
        print("Validated data:", validated_data)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
class InternshipSerializer(serializers.ModelSerializer):
   
    project_details = ProjectSerializer(source='Project_id', read_only=True)
    Intern_details=InternSerializer(source='intern_id',read_only=True)
    class Meta:
        model = Internship
        fields =(    'id',
            'Project_id',
            'intern_id',
            'University',
            'Start_Date',
            'End_Date',
            'Year_of_study',
            'Project_year',
            'Promotion',
            'Certified',
            'PDF_Agreement',
            'PDF_Prolongement',
            'PDF_Certified',
            'Code_file',
            'Report_PDF',
            'Presentation_PDF','project_details', 'Intern_details',)

    def get_certified(self, obj):
        return "true" if obj.Certified else "false"
    
    def create(self, validated_data):
        return Internship.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
@receiver(post_save, sender=CustomUser)
def assign_permissions_based_on_type(sender, instance, created, **kwargs):
    if created:
        if instance.type_of_user == "As_admin":
            perms = Permission.objects.all()
            instance.user_permissions.set(perms)
        elif instance.type_of_user == "As_Member":
            allowed_perms = Permission.objects.filter(
                content_type__app_label='api',
                codename__in=[
                    'PersonViewSet', 'sup_stageViewSet','StagiaireViewSet','SuperviserViewSet'  # seulement lecture
                    
                ]
            )
            instance.user_permissions.set(allowed_perms)