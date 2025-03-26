from django.contrib import admin
from .models import Stage,Stagiaire,Superviser,Membre

# Register your models here.

admin.site.register(Stage)
admin.site.register(Stagiaire)
admin.site.register(Membre)
admin.site.register(Superviser)
