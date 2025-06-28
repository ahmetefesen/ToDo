from django.shortcuts import render, redirect
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, UpdateView, DeleteView, FormView
from django.urls import reverse_lazy

from django.contrib.auth.views import LoginView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages

# Imports for Reordering Feature
from django.views import View
from django.shortcuts import redirect
from django.db import transaction

from .models import Task
from .forms import PositionForm

from rest_framework import generics, permissions
from .serializers import (
    TaskSerializer, UserProfileSerializer, TeamSerializer, TaskCommentSerializer, TaskAttachmentSerializer, TaskPrioritySerializer, TaskScheduleSerializer, TaskRecurrenceSerializer, TaskDependenceSerializer, HistorySerializer, TaskReportSerializer, UserTeamsSerializer
)
from .models import (
    Task, UserProfile, Team, TaskComment, TaskAttachment, TaskPriority, TaskSchedule, TaskRecurrence, TaskDependence, History, TaskReport, UserTeams
)

# Logging imports
from .utils import SecurityLogger, OperationLogger, ErrorLogger

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

def get_client_ip(request):
    """Client IP adresini al"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

class CustomLoginView(LoginView):
    template_name = 'base/login.html'
    fields = '__all__'
    redirect_authenticated_user = True

    def get_success_url(self):
        return reverse_lazy('tasks')

    def form_valid(self, form):
        """Başarılı login işlemi"""
        response = super().form_valid(form)
        # Log başarılı login
        SecurityLogger.log_login_success(self.request.user, get_client_ip(self.request))
        return response

    def form_invalid(self, form):
        """Başarısız login işlemi"""
        # Log başarısız login
        username = form.cleaned_data.get('username', 'Bilinmeyen kullanıcı')
        SecurityLogger.log_login_failure(username, get_client_ip(self.request), "Yanlış şifre veya kullanıcı adı")
        return super().form_invalid(form)

class RegisterPage(FormView):
    template_name = 'base/register.html'
    form_class = UserCreationForm
    redirect_authenticated_user = True
    success_url = reverse_lazy('login')

    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        if request.content_type == 'application/json':
            import json
            from django.http import JsonResponse
            data = json.loads(request.body)
            
            # Frontend'den gelen password'ü password1 ve password2'ye dönüştür
            if 'password' in data and 'password2' not in data:
                data['password1'] = data['password']
                data['password2'] = data['password']
            
            form = self.form_class(data)
            if form.is_valid():
                user = form.save()
                return JsonResponse({'success': True, 'message': 'Kayıt başarılı.'}, status=201)
            else:
                return JsonResponse(form.errors, status=400)
        else:
            return super().post(request, *args, **kwargs)

    def form_valid(self, form):
        user = form.save()
        if user is not None:
            messages.success(self.request, 'Kayıt başarılı, şimdi giriş yapabilirsin.')
        return super(RegisterPage, self).form_valid(form)

    def form_invalid(self, form):
        # Formu tamamen sıfırla
        form = self.form_class()
        return self.render_to_response(self.get_context_data(form=form))

    def get(self, *args, **kwargs):
        if self.request.user.is_authenticated:
            return redirect('tasks')
        return super(RegisterPage, self).get(*args, **kwargs)

class TaskList(LoginRequiredMixin, ListView):
    model = Task
    context_object_name = 'tasks'

    def get_queryset(self):
        # Admin kullanıcıları tüm görevleri görebilir
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Task.objects.all()
        # Normal kullanıcılar sadece kendi görevlerini görebilir
        return Task.objects.filter(user=self.request.user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Sadece kullanıcının kendi görevlerini say
        if self.request.user.is_staff or self.request.user.is_superuser:
            context['count'] = context['tasks'].filter(status__in=['pending', 'incomplete', 'todo']).count()
        else:
            context['count'] = context['tasks'].filter(user=self.request.user, status__in=['pending', 'incomplete', 'todo']).count()

        search_input = self.request.GET.get('search-area') or ''
        if search_input:
            context['tasks'] = context['tasks'].filter(
                title__icontains=search_input)

        context['search_input'] = search_input
        return context

    def get(self, request, *args, **kwargs):
        """Sayfa yüklendiğinde log kaydı"""
        try:
            response = super().get(request, *args, **kwargs)
            # Log sayfa erişimi
            OperationLogger.log_api_access(
                request.user, 
                'Task List', 
                'GET', 
                get_client_ip(request)
            )
            return response
        except Exception as e:
            ErrorLogger.log_system_error(str(e), get_client_ip(request))
            raise

class TaskDetail(LoginRequiredMixin, DetailView):
    model = Task
    context_object_name = 'task'
    template_name = 'base/task.html'

    def get_queryset(self):
        # Admin kullanıcıları tüm görevleri görebilir
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Task.objects.all()
        # Normal kullanıcılar sadece kendi görevlerini görebilir
        return Task.objects.filter(user=self.request.user)

class TaskCreate(LoginRequiredMixin, CreateView):
    model = Task
    fields = ['title', 'description', 'status', 'priority', 'due_date']
    success_url = reverse_lazy('tasks')

    def form_valid(self, form):
        form.instance.user = self.request.user
        response = super(TaskCreate, self).form_valid(form)
        # Log görev oluşturma
        OperationLogger.log_task_created(
            self.request.user, 
            form.instance.title, 
            get_client_ip(self.request)
        )
        return response

    def form_invalid(self, form):
        """Form validation hatası"""
        for field, errors in form.errors.items():
            for error in errors:
                ErrorLogger.log_validation_error(
                    self.request.user, 
                    field, 
                    error, 
                    get_client_ip(self.request)
                )
        return super().form_invalid(form)

class TaskUpdate(LoginRequiredMixin, UpdateView):
    model = Task
    fields = ['title', 'description', 'status', 'priority', 'due_date']
    success_url = reverse_lazy('tasks')

    def get_queryset(self):
        # Admin kullanıcıları tüm görevleri düzenleyebilir
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Task.objects.all()
        # Normal kullanıcılar sadece kendi görevlerini düzenleyebilir
        return Task.objects.filter(user=self.request.user)

    def form_valid(self, form):
        old_instance = self.get_object()
        changes = []
        
        # Değişiklikleri tespit et
        for field in form.changed_data:
            old_value = getattr(old_instance, field)
            new_value = form.cleaned_data[field]
            changes.append(f"{field}: {old_value} -> {new_value}")
        
        response = super(TaskUpdate, self).form_valid(form)
        
        # Log görev güncelleme
        if changes:
            OperationLogger.log_task_updated(
                self.request.user, 
                form.instance.title, 
                ", ".join(changes), 
                get_client_ip(self.request)
            )
        
        return response

    def form_invalid(self, form):
        """Form validation hatası"""
        for field, errors in form.errors.items():
            for error in errors:
                ErrorLogger.log_validation_error(
                    self.request.user, 
                    field, 
                    error, 
                    get_client_ip(self.request)
                )
        return super().form_invalid(form)

class DeleteView(LoginRequiredMixin, DeleteView):
    model = Task
    context_object_name = 'task'
    success_url = reverse_lazy('tasks')
    
    def get_queryset(self):
        # Admin kullanıcıları tüm görevleri silebilir
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Task.objects.all()
        # Normal kullanıcılar sadece kendi görevlerini silebilir
        return Task.objects.filter(user=self.request.user)

    def delete(self, request, *args, **kwargs):
        """Görev silme işlemi"""
        task = self.get_object()
        task_title = task.title
        
        response = super().delete(request, *args, **kwargs)
        
        # Log görev silme
        OperationLogger.log_task_deleted(
            request.user, 
            task_title, 
            get_client_ip(request)
        )
        
        return response

class TaskReorder(View):
    def post(self, request):
        form = PositionForm(request.POST)

        if form.is_valid():
            positionList = form.cleaned_data["position"].split(',')

            with transaction.atomic():
                self.request.user.set_task_order(positionList)

        return redirect(reverse_lazy('tasks'))

# --- REST API VIEWS ---

# Task
class TaskListCreateAPI(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Admin kullanıcıları tüm görevleri görebilir
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Task.objects.all()
        # Normal kullanıcılar sadece kendi görevlerini görebilir
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        task = serializer.save(user=self.request.user)
        # Log API görev oluşturma - hata olursa işlemi durdurma
        try:
            OperationLogger.log_task_created(
                self.request.user, 
                task.title, 
                get_client_ip(self.request)
            )
        except Exception as log_error:
            # Log hatası işlemi durdurmamalı
            print(f"Log hatası: {log_error}")

    def list(self, request, *args, **kwargs):
        """API list endpoint"""
        try:
            response = super().list(request, *args, **kwargs)
            # Log API erişimi - hata olursa işlemi durdurma
            try:
                OperationLogger.log_api_access(
                    request.user, 
                    'API Task List', 
                    'GET', 
                    get_client_ip(request)
                )
            except Exception as log_error:
                # Log hatası işlemi durdurmamalı
                print(f"Log hatası: {log_error}")
            return response
        except Exception as e:
            ErrorLogger.log_system_error(str(e), get_client_ip(request))
            raise

class TaskDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Admin kullanıcıları tüm görevleri görebilir
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Task.objects.all()
        # Normal kullanıcılar sadece kendi görevlerini görebilir
        return Task.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        """API update endpoint"""
        try:
            response = super().update(request, *args, **kwargs)
            # Log API görev güncelleme - hata olursa işlemi durdurma
            try:
                OperationLogger.log_task_updated(
                    request.user, 
                    self.get_object().title, 
                    "API üzerinden güncellendi", 
                    get_client_ip(request)
                )
            except Exception as log_error:
                # Log hatası işlemi durdurmamalı
                print(f"Log hatası: {log_error}")
            return response
        except Exception as e:
            ErrorLogger.log_system_error(str(e), get_client_ip(request))
            raise

    def destroy(self, request, *args, **kwargs):
        """API delete endpoint"""
        try:
            task = self.get_object()
            task_title = task.title
            
            response = super().destroy(request, *args, **kwargs)
            
            # Log API görev silme - hata olursa işlemi durdurma
            try:
                OperationLogger.log_task_deleted(
                    request.user, 
                    task_title, 
                    get_client_ip(request)
                )
            except Exception as log_error:
                # Log hatası işlemi durdurmamalı
                print(f"Log hatası: {log_error}")
            
            return response
        except Exception as e:
            ErrorLogger.log_system_error(str(e), get_client_ip(request))
            raise

# UserProfile
class UserProfileListCreateAPI(generics.ListCreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserProfileDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

# Team
class TeamListCreateAPI(generics.ListCreateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

class TeamDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

# TaskComment
class TaskCommentListCreateAPI(generics.ListCreateAPIView):
    queryset = TaskComment.objects.all()
    serializer_class = TaskCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskCommentDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskComment.objects.all()
    serializer_class = TaskCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

# TaskAttachment
class TaskAttachmentListCreateAPI(generics.ListCreateAPIView):
    queryset = TaskAttachment.objects.all()
    serializer_class = TaskAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskAttachmentDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskAttachment.objects.all()
    serializer_class = TaskAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]

# TaskPriority
class TaskPriorityListCreateAPI(generics.ListCreateAPIView):
    queryset = TaskPriority.objects.all()
    serializer_class = TaskPrioritySerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskPriorityDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskPriority.objects.all()
    serializer_class = TaskPrioritySerializer
    permission_classes = [permissions.IsAuthenticated]

# TaskSchedule
class TaskScheduleListCreateAPI(generics.ListCreateAPIView):
    queryset = TaskSchedule.objects.all()
    serializer_class = TaskScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskScheduleDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskSchedule.objects.all()
    serializer_class = TaskScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]

# TaskRecurrence
class TaskRecurrenceListCreateAPI(generics.ListCreateAPIView):
    queryset = TaskRecurrence.objects.all()
    serializer_class = TaskRecurrenceSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskRecurrenceDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskRecurrence.objects.all()
    serializer_class = TaskRecurrenceSerializer
    permission_classes = [permissions.IsAuthenticated]

# TaskDependence
class TaskDependenceListCreateAPI(generics.ListCreateAPIView):
    queryset = TaskDependence.objects.all()
    serializer_class = TaskDependenceSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskDependenceDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskDependence.objects.all()
    serializer_class = TaskDependenceSerializer
    permission_classes = [permissions.IsAuthenticated]

# History
class HistoryListCreateAPI(generics.ListCreateAPIView):
    queryset = History.objects.all()
    serializer_class = HistorySerializer
    permission_classes = [permissions.IsAuthenticated]

class HistoryDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = History.objects.all()
    serializer_class = HistorySerializer
    permission_classes = [permissions.IsAuthenticated]

# TaskReport
class TaskReportListCreateAPI(generics.ListCreateAPIView):
    queryset = TaskReport.objects.all()
    serializer_class = TaskReportSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskReportDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskReport.objects.all()
    serializer_class = TaskReportSerializer
    permission_classes = [permissions.IsAuthenticated]

# UserTeams
class UserTeamsListCreateAPI(generics.ListCreateAPIView):
    queryset = UserTeams.objects.all()
    serializer_class = UserTeamsSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserTeamsDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserTeams.objects.all()
    serializer_class = UserTeamsSerializer
    permission_classes = [permissions.IsAuthenticated]

def custom_logout(request):
    # Mesajları temizle
    from django.contrib.messages import get_messages
    storage = get_messages(request)
    storage.used = True
    
    logout(request)
    return redirect('login')

class TaskToggleCompleteView(LoginRequiredMixin, View):
    def post(self, request, pk):
        try:
            # Admin kullanıcıları tüm görevleri görebilir
            if request.user.is_staff or request.user.is_superuser:
                task = Task.objects.get(pk=pk)
            else:
                task = Task.objects.get(pk=pk, user=request.user)
            
            if task.status == 'completed':
                task.status = 'pending'
            else:
                task.status = 'completed'
            task.save()
            
            # Log görev durumu değişikliği - hata olursa işlemi durdurma
            try:
                OperationLogger.log_task_updated(
                    request.user, 
                    task.title, 
                    f"Durum {task.status} olarak değiştirildi", 
                    get_client_ip(request)
                )
            except Exception as log_error:
                # Log hatası işlemi durdurmamalı
                print(f"Log hatası: {log_error}")
            
            # API isteği ise JSON döndür
            if request.content_type == 'application/json':
                from django.http import JsonResponse
                return JsonResponse({
                    'success': True, 
                    'message': f"'{task.title}' görevinin durumu güncellendi.",
                    'status': task.status
                })
            
            # Template isteği ise mesaj göster ve yönlendir
            messages.success(request, f"'{task.title}' görevinin durumu güncellendi.")
            return redirect('tasks')
            
        except Task.DoesNotExist:
            if request.content_type == 'application/json':
                from django.http import JsonResponse
                return JsonResponse({'error': 'Görev bulunamadı.'}, status=404)
            messages.error(request, 'Görev bulunamadı.')
            return redirect('tasks')
        except Exception as e:
            ErrorLogger.log_system_error(str(e), get_client_ip(request))
            if request.content_type == 'application/json':
                from django.http import JsonResponse
                return JsonResponse({'error': 'Bir hata oluştu.'}, status=500)
            messages.error(request, 'Bir hata oluştu.')
            return redirect('tasks')
