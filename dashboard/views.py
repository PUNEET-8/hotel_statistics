from django.shortcuts import render
from django.views.generic import View
from .forms import *
from django.http import HttpResponseRedirect
from django.shortcuts import render, reverse
from django.contrib import messages
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from braces.views import LoginRequiredMixin
from django.views.generic import TemplateView
# Create your views here.
class LoginView(View):
    form_class = AdminLoginForm
    template_name = "admin/sessions/login.html"
    def get(self, request):
        if request.user.is_superuser:
            return HttpResponseRedirect(reverse('dashboard'))
        form = self.form_class()
        return render(request, self.template_name, {'form': form})

    def post(self, request):
        email = request.POST.get('email', None)
        password = request.POST.get('password', None)
        if email and password:
            if "@" in email:
                users = User.objects.filter(email__iexact=email)
            else:
                users = User.objects.filter(mobile_number__iexact=email)
            if users.exists() and users.first().check_password(password):
                user_obj = users.first()

                if user_obj.is_active and (user_obj.is_staff or user_obj.is_superuser):
                    token, created = Token.objects.get_or_create(user=user_obj)
                    login(request, user_obj)
                    print("hjbhjbhjbhjbhjbvhjvgjgyugyhjgyhjgyhugyujg")
                    if request.POST.get('remember_me') == 'on':
                        request.session.set_expiry(1209600)
                    messages.success(request, 'Login successfully')
                    return HttpResponseRedirect(reverse('dashboard'))
                else:
                    messages.info(request, 'Account is not active')
                    return HttpResponseRedirect(reverse('admin-login'))
            else:
                message = "Unable to login with given credentials"
                messages.info(request, message)
                return HttpResponseRedirect(reverse('admin-login'))
        else:
            message = "Invalid login details."
            messages.error(request, message)
            return HttpResponseRedirect(reverse('admin-login'))



class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = "admin/dashboard/index.html"
    def get(self, request, **kwargs):
        if False in [request.user.is_staff, request.user.is_superuser]:
            logout(request)
            messages.success(request, "You are not allowed to access this page")
            return HttpResponseRedirect(reverse('admin-login'))
        return super(DashboardView, self).get(request)