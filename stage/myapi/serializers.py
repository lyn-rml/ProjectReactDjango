from rest_framework import serializers
from .models import Stage
from .models import Stagiaire
from .models import Superviser
from .models import Membre
from .models import super_stage
from .models import stage_stagiaire

# minim=date.today()

# def mindate(value):
#     if(value<minim):
#         raise serializers.ValidationError(f"Date must be higher than {minim}.")
#     return value

class miniMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model=Membre
        fields=('id','Nom','Prenom')


class MembreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membre
        fields = '__all__'

    def create(self, validated_data):
        return Membre.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Separate the file data from other fields
        file_data = validated_data.pop('Application_PDF', None)

        # Update the remaining fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # If a new file is uploaded, set it
        if file_data:
            instance.Application_PDF = file_data

        # Save the instance after updates
        instance.save()
        return instance

    def validate_is_sup(self, value):
        # Ensure that 'is_sup' is always a boolean
        if isinstance(value, str):
            value = value.lower() == "true"
        return value

    

class miniSuperviserSerializer(serializers.ModelSerializer):
    superviser_name=serializers.SerializerMethodField()
    class Meta:
        model=Superviser
        fields=('id','superviser_name')
        def get_superviser_name(self, obj):
            return '{} {}'.format(obj.Prenom, obj.Nom) 
    def create(self, validated_data):
        return Superviser.objects.create(**validated_data)
    def update(self, validated_data):
        return Superviser.objects.update(**validated_data)


class StageSerializer(serializers.ModelSerializer):
    # Supervisers=SuperviserSerializer(many=True)
    class Meta:
        model = Stage
        fields = '__all__'
    def create(self, validated_data):
        return Stage.objects.create(**validated_data)
    def update(self, instance, validated_data):
        # Met à jour les champs existants
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
class SuperviserSerializer(serializers.ModelSerializer):
    #stage=StageSerializer(many=True)
    class Meta:
        model = Superviser
        fields= '__all__'
        # fields = ('id','Nom','Prenom','Telephone','Id_Membre','Profession','Email')  
    def create(self, validated_data):
        return Superviser.objects.create(**validated_data)
    def update(self, instance, validated_data):
        """Correctly updates an existing supervisor"""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)  # Set each validated field
        instance.save()
        return instance  

class supstageSerializer(serializers.ModelSerializer):
    # superviser=miniSuperviserSerializer(many=True)
    # stage=StageSerializer()
    stage_domain=serializers.StringRelatedField(source="stage.Domain")
    stage_title=serializers.StringRelatedField(source="stage.Title")
    stage_spec=serializers.StringRelatedField(source="stage.Speciality")
    stage_pris=serializers.StringRelatedField(source="stage.Sujet_pris")
    superviser_name=serializers.StringRelatedField(source="superviser")
    stage_pdf=serializers.StringRelatedField(source="stage.PDF_sujet")
    stage_date_register=serializers.StringRelatedField(source="stage.Date_register")
    class Meta:
        model = super_stage
        fields = ('id','stage','superviser','is_admin','superviser_name','stage_domain','stage_title','stage_spec','stage_pris','stage_pdf','stage_date_register')#
    def create(self, validated_data):
        print("Validated data:",validated_data)
        sup_stage = super_stage.objects.create(**validated_data)
        return sup_stage 
    def update(self, instance, validated_data):
        print("Validated data:", validated_data)

        for attr, value in validated_data.items():
             setattr(instance, attr, value)  # Mise à jour de chaque champ

        instance.save()  # Sauvegarde des modifications dans la base de données
        return instance  # Ret       

class StagiaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stagiaire
        fields= '__all__'
    def create(self, validated_data):
        return Stagiaire.objects.create(**validated_data)
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)  # Set each validated field
        instance.save()
        return instance  

class join_project_stagierSerializer(serializers.ModelSerializer):
    # Related fields (read-only display, can still provide actual IDs via write fields)
    stagiaire_id = serializers.IntegerField(source='stagiaire.id', read_only=True)
    stage_id = serializers.IntegerField(source='stage.id', read_only=True)
    stagiaire_nom = serializers.CharField(source='stagiaire.Nom', read_only=True)
    stagiaire_prenom = serializers.CharField(source='stagiaire.Prenom', read_only=True)
    stagiaire_email = serializers.CharField(source='stagiaire.Email', read_only=True)
    stage_titre = serializers.CharField(source='stage.Title', read_only=True)

    # Custom/Computed fields
    certified = serializers.SerializerMethodField()
    extra_info = serializers.SerializerMethodField()

    # Actual model fields for write
    stagiaire = serializers.PrimaryKeyRelatedField(queryset=Stagiaire.objects.all(), write_only=True)
    stage = serializers.PrimaryKeyRelatedField(queryset=Stage.objects.all(), write_only=True)
    Universite = serializers.CharField(required=True)
    Promotion = serializers.CharField(required=True)
    Annee_etude = serializers.CharField(required=True)
    Annee = serializers.IntegerField(required=True)
    Date_debut = serializers.DateField(required=True)
    Date_fin = serializers.DateField(required=True)
    Certified = serializers.BooleanField(required=False)

    PDF_Agreement = serializers.FileField(required=True)
    PDF_Prolongement = serializers.FileField(required=False)
    PDF_Certificate = serializers.FileField(required=False)
    Code = serializers.FileField(required=False)
    Rapport = serializers.FileField(required=False)
    Presentation = serializers.FileField(required=False)

    class Meta:
        model = stage_stagiaire
        fields = [
            'id', 'stagiaire', 'stagiaire_id', 'stagiaire_nom', 'stagiaire_prenom', 'stagiaire_email',
            'stage', 'stage_id', 'stage_titre',
            'Universite', 'Promotion', 'Annee_etude', 'Annee', 'Date_debut', 'Date_fin',
            'Certified', 'certified', 'extra_info',
            'PDF_Agreement', 'PDF_Prolongement', 'PDF_Certificate',
            'Code', 'Rapport', 'Presentation'
        ]

    def get_certified(self, obj):
        return "true" if obj.Certified else "false"

    def get_extra_info(self, obj):
        return f"{obj.Universite} - {obj.Promotion} ({obj.Annee})"
    def validate(self, data):
        # Vérifier si 'Certified' est True
        if data.get('Certified'):
            if not data.get('PDF_Certificate'):
                raise serializers.ValidationError("PDF Certificate is required when Certified is True.")
            if not data.get('Rapport'):
                raise serializers.ValidationError("Rapport is required when Certified is True.")
            if not data.get('Code'):
                raise serializers.ValidationError("Code is required when Certified is True.")
            if not data.get('Presentation'):
                raise serializers.ValidationError("Presentation is required when Certified is True.")
        return data
    
    def create(self, validated_data):
        print("Validated data:", validated_data)
        return stage_stagiaire.objects.create(**validated_data)

    def update(self, instance, validated_data):
        print("Validated data (update):", validated_data)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
