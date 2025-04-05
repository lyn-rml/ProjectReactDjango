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
        for attr, value in validated_data.items():
            setattr(instance, attr, value)  # Set each validated field
        instance.save()
        return instance  
    def validate_is_sup(self, value):
        # Ensure that is_sup is always a boolean
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
    stagiaire_nom = serializers.CharField(source='stagiaire.Nom', read_only=True)
    stagiaire_prenom = serializers.CharField(source='stagiaire.Prenom', read_only=True)
    stagiaire_email = serializers.CharField(source='stagiaire.Email', read_only=True)
    promotion = serializers.CharField(source='Promotion', read_only=True)
    annee = serializers.CharField(source='Annee', read_only=True)
    stage_titre = serializers.CharField(source='stage.Title', read_only=True)
    date_debut = serializers.DateField(source='Date_debut', read_only=True)
    date_fin = serializers.DateField(source='Date_fin', read_only=True)
    
    certified = serializers.SerializerMethodField() 
    convention = serializers.FileField(source='PDF_Agreement', read_only=True)

    class Meta:
        model = stage_stagiaire
        fields = [
            'id', 'stagiaire_nom', 'stagiaire_prenom', 'stagiaire_email', 
            'promotion', 'stage_titre', 'date_debut', 'date_fin', 
            'certified', 'convention','annee'
        ]
         
    def get_certified(self, obj):
        return "true" if obj.Certified else "false"    
    def create(self, validated_data):
        print("Validated data:",validated_data)
        join_stage_interns = stage_stagiaire.objects.create(**validated_data)
        return join_stage_interns 
    def update(self, instance, validated_data):
        print("Validated data:",validated_data)
        stage_stagiaire=stage_stagiaire.objects.update(instance,**validated_data)
        return stage_stagiaire    