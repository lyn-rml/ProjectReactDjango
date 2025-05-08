from rest_framework import serializers
from .models import Project
from .models import Intern
from .models import Supervisor
from .models import Member
from .models import supervisor_internship
from .models import Internship
from .models import Person
from .models import Payment_history
from django.db.models.signals import post_save
from django.contrib.auth.models import Permission
from django.dispatch import receiver



class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__' 
        extra_kwargs = {
            'email': {'required': True}
         }  
    def validate_email(self, value):
        if not value or value.strip() == "":
            raise serializers.ValidationError("Email est requis et ne peut pas être vide.")
        if Person.objects.filter(email=value).exists():
            raise serializers.ValidationError("Cet email existe déjà. Veuillez en choisir un autre.")
        return value    
class MemberSerializer(serializers.ModelSerializer):
    is_superviser = serializers.SerializerMethodField()
    id = serializers.IntegerField(read_only=True)  # Include id from Person
    member_payed = serializers.SerializerMethodField()
    class Meta:
        model = Member
        fields = (
            'id',  # inherited from Person
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'profession',
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
            'member_payed'
        )

        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'phone_number': {'required': True},
            'profession': {'required': True},
        }

    def get_is_superviser(self, obj):
        return Supervisor.objects.filter(Id_Membre=obj).exists()
    def get_member_payed(self, obj):
        latest_payment = Payment_history.objects.filter(Id_Membre=obj).order_by('-Payment_date').first()
        if latest_payment:
            return latest_payment.payed
        return False
    def create(self, validated_data):
        # Extract Person fields
        person_fields = {
            'first_name': validated_data.pop('first_name'),
            'last_name': validated_data.pop('last_name'),
            'email': validated_data.pop('email'),
            'phone_number': validated_data.pop('phone_number'),
            'profession': validated_data.pop('profession'),
        }

        # Validate required fields
        if not all(person_fields.values()):
            raise serializers.ValidationError("Tous les champs personnels sont requis.")

        # Create Member directly, this will automatically create a Person instance as well
        member = Member.objects.create(**person_fields, **validated_data)

        return member

class SupervisorSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Supervisor
        fields = (
            'id',  # inherited from Person
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'profession',
            'Id_Membre',
            
        )  
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'phone_number': {'required': True},
            'profession': {'required': True},
        }    
    
    def create(self, validated_data):
        # Check if the 'Id_Membre' is provided
        id_member = validated_data.get('Id_Membre')
        
        # If 'Id_Membre' exists, inherit data from the associated Member (Person)
        if id_member:
            person_fields = {
                'first_name': id_member.first_name,  # from Member (Person)
                'last_name': id_member.last_name,
                'email': id_member.email,
                'phone_number': id_member.phone_number,
                'profession': id_member.profession,  # or any other field you need
            }
        else:
            # Otherwise, use the data passed directly (if no Id_Membre)
            person_fields = {
                'first_name': validated_data.pop('first_name'),
                'last_name': validated_data.pop('last_name'),
                'email': validated_data.pop('email'),
                'phone_number': validated_data.pop('phone_number'),
                'profession': validated_data.pop('profession'),
            }
        
        # Create Supervisor with inherited or directly provided data
        supervisor = Supervisor.objects.create(**person_fields, **validated_data)
        return supervisor
    
    def update(self, instance, validated_data):
        # Update the Supervisor and inherit from Person if Id_Membre is provided
        id_member = validated_data.get('Id_Membre')
        if id_member:
            instance.first_name = id_member.first_name
            instance.last_name = id_member.last_name
            instance.email = id_member.email
            instance.phone_number = id_member.phone_number
            instance.profession = id_member.profession
        
        # Update the remaining fields if necessary
        for attr, value in validated_data.items():
            if attr not in ['Id_Membre']:  # Don't overwrite Id_Membre
                setattr(instance, attr, value)
        
        instance.save()
        return instance
        
class ProjectSerializer(serializers.ModelSerializer):
    interns = serializers.SerializerMethodField()
    has_interns = serializers.SerializerMethodField()
    supervisors = serializers.SerializerMethodField()
    # Supervisers=SuperviserSerializer(many=True)
    class Meta:
        model = Project
        fields = '__all__'
    def get_interns(self, obj):
        internships = Internship.objects.filter(Project_id=obj)
        return [internship.intern_id.id for internship in internships]

    def get_has_interns(self, obj):
        return Internship.objects.filter(Project_id=obj).exists()   
    def get_supervisors(self, obj):
        supervisors_stages =  supervisor_internship.objects.filter(project_id=obj)
        return [ss.supervisor_id.id for ss in supervisors_stages]

    
    def create(self, validated_data):
        return Project.objects.create(**validated_data)
    def update(self, instance, validated_data):
        # Met à jour les champs existants
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    


class SupervisorInternshipSerializer(serializers.ModelSerializer):
    project_title = serializers.StringRelatedField(source="project_id.Title")
    supervisor_name = serializers.StringRelatedField(source="supervisor_id")
    project_Domain = serializers.StringRelatedField(source="project_id.Domain")
    project_Speciality = serializers.StringRelatedField(source="project_id.Speciality")
    project_date_register=serializers.StringRelatedField(source="project_id.Date_register")
    project_is_taken=serializers.StringRelatedField(source="project_id.is_taken")
    first_name=serializers.StringRelatedField(source="supervisor_id.first_name")
    last_name=serializers.StringRelatedField(source="supervisor_id.last_name")
    class Meta:
        model = supervisor_internship
        fields = ('id', 'supervisor_id', 'project_id', 'Role', 'project_title', 'supervisor_name','project_Domain','project_Speciality','project_date_register','project_is_taken','first_name','last_name')

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

    class Meta:
        model = Intern
        fields = ('id',  # inherited from Person
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'profession','projects', 'has_projects', 'Id_Membre', 'available')
        
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'phone_number': {'required': True},
            'profession': {'required': True},
        }    
    def get_projects(self, obj):
        internships = Internship.objects.filter(intern_id=obj)
        projects = [intern.Project_id for intern in internships]
        return ProjectSerializer(projects, many=True).data

    def get_has_projects(self, obj):
        return Internship.objects.filter(intern_id=obj).exists()

    def create(self, validated_data):
        # Check if Id_Membre is provided to inherit data from Person (Member or Supervisor)
        id_member = validated_data.get('Id_Membre')
        if id_member:
            # Inherit data from the Member or Supervisor (Person)
            person_fields = {
                'first_name': id_member.first_name,  # assuming Id_Membre is a Member or Supervisor
                'last_name': id_member.last_name,
                'email': id_member.email,
                'phone_number': id_member.phone_number,
                'profession': id_member.profession,  # Or any other field you need
            }
        else:
            # If no Id_Membre, use the data provided for the Intern
            person_fields = {
                'first_name': validated_data.pop('first_name'),
                'last_name': validated_data.pop('last_name'),
                'email': validated_data.pop('email'),
                'phone_number': validated_data.pop('phone_number'),
                'profession': validated_data.pop('profession'),
            }
        
        # Create the Intern instance with inherited or provided data
        intern = Intern.objects.create(**person_fields, **validated_data)
        return intern

    def update(self, instance, validated_data):
        # Check if Id_Membre is provided to inherit data from the related Person (Member or Supervisor)
        id_member = validated_data.get('Id_Membre')
        if id_member:
            instance.first_name = id_member.first_name
            instance.last_name = id_member.last_name
            instance.email = id_member.email
            instance.phone_number = id_member.phone_number
            instance.profession = id_member.profession

        # Update the remaining fields if necessary
        for attr, value in validated_data.items():
            if attr not in ['Id_Membre']:  # Don't overwrite Id_Membre
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
class PaymentHistorySerializer(serializers.ModelSerializer):
    first_name=serializers.StringRelatedField(source="Id_Membre.first_name")
    last_name=serializers.StringRelatedField(source="Id_Membre.last_name")
   
    class Meta:
        model = Payment_history
        fields = '__all__'