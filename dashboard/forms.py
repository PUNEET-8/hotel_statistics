from django import forms
from users.models import User

class AdminLoginForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('email', 'password',)