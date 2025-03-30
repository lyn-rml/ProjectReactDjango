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
    def update(self, validated_data):
        return Membre.objects.update(**validated_data)

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
    def update(self, validated_data):
        return Stage.objects.update(**validated_data)

class SuperviserSerializer(serializers.ModelSerializer):
    #stage=StageSerializer(many=True)
    class Meta:
        model = Superviser
        fields= '__all__'
        # fields = ('id','Nom','Prenom','Telephone','Id_Membre','Profession','Email')  
    def create(self, validated_data):
        return Superviser.objects.create(**validated_data)
    def update(self, validated_data):
        return Superviser.objects.update(**validated_data)

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
        print("Validated data:",validated_data)
        sup_stage=super_stage.objects.update(instance,**validated_data)
        return sup_stage          

class StagiaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stagiaire
        fields= '__all__'
    def create(self, validated_data):
        return Stagiaire.objects.create(**validated_data)
    def update(self, validated_data):
        return Stagiaire.objects.update(**validated_data)

class join_project_stagierSerializer(serializers.ModelSerializer):
     date_debut=serializers.StringRelatedField(source="stage.Date_debut")
     date_fin=serializers.StringRelatedField(source="stage.Date_fin")
     intern_name=serializers.StringRelatedField(source="stagiaire")
     intern_email=serializers.StringRelatedField(source="stagiaire.Email")
     intern_promotion=serializers.StringRelatedField(source="stagiaire.Promotion")
     internship_name=serializers.StringRelatedField(source="stage")
     internship_year=serializers.StringRelatedField(source="stagiaire.Annee")
     class Meta:
         model = stage_stagiaire
         fields = ('id','stage','stagiaire','intern_name','intern_email','intern_promotion','internship_name','internship_year','PDF_Agreement','PDF_Prolongement','PDF_Certificate','date_debut','date_fin','Certified','Universite','Promotion','Annee_etude','Annee','Code','Rapport','Presentation')
         
     def create(self, validated_data):
        print("Validated data:",validated_data)
        join_stage_interns = stage_stagiaire.objects.create(**validated_data)
        return join_stage_interns 
     def update(self, instance, validated_data):
        print("Validated data:",validated_data)
        stage_stagiaire=stage_stagiaire.objects.update(instance,**validated_data)
        return stage_stagiaire    