from django.shortcuts import render, redirect
from django.views import View
from django.shortcuts import redirect
from django.db import transaction
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework import generics, permissions
from .serializers import (
    TaskSerializer, UserProfileSerializer, TeamSerializer, TaskCommentSerializer, TaskAttachmentSerializer, TaskPrioritySerializer, TaskScheduleSerializer, TaskRecurrenceSerializer, TaskDependenceSerializer, HistorySerializer, TaskReportSerializer, UserTeamsSerializer, RegisterSerializer
)
from .models import (
    Task, UserProfile, Team, TaskComment, TaskAttachment, TaskPriority, TaskSchedule, TaskRecurrence, TaskDependence, History, TaskReport, UserTeams
)

# Logging imports
from .utils import SecurityLogger, OperationLogger, ErrorLogger
from rest_framework.response import Response
from rest_framework import status

def get_client_ip(request):
    """Client IP adresini al"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

# API Views
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
        serializer.save(user=self.request.user)
        # Log görev oluşturma
        OperationLogger.log_task_created(
            self.request.user, 
            serializer.instance.title, 
            get_client_ip(self.request)
        )

    def list(self, request, *args, **kwargs):
        """Liste görüntüleme"""
        try:
            response = super().list(request, *args, **kwargs)
            # Log API erişimi
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
        """Görev güncelleme"""
        try:
            old_task = self.get_object()
            old_data = {
                'title': old_task.title,
                'description': old_task.description,
                'status': old_task.status,
                'priority': old_task.priority,
                'due_date': str(old_task.due_date) if old_task.due_date else None
            }
            response = super().update(request, *args, **kwargs)
            new_task = self.get_object()
            new_data = {
                'title': new_task.title,
                'description': new_task.description,
                'status': new_task.status,
                'priority': new_task.priority,
                'due_date': str(new_task.due_date) if new_task.due_date else None
            }
            # Değişen alanları bul
            changes = []
            for key in old_data:
                if old_data[key] != new_data[key]:
                    changes.append(f"{key}: '{old_data[key]}' → '{new_data[key]}'")
            changes_str = ", ".join(changes) if changes else "Değişiklik yok"
            # Log görev güncelleme
            OperationLogger.log_task_updated(
                request.user, 
                new_task.title, 
                changes_str, 
                get_client_ip(request)
            )
            return response
        except Exception as e:
            ErrorLogger.log_system_error(str(e), get_client_ip(request))
            raise

    def destroy(self, request, *args, **kwargs):
        """Görev silme"""
        try:
            task = self.get_object()
            task_title = task.title
            response = super().destroy(request, *args, **kwargs)
            # Log görev silme
            OperationLogger.log_task_deleted(
                request.user, 
                task_title, 
                get_client_ip(request)
            )
            return response
        except Exception as e:
            ErrorLogger.log_system_error(str(e), get_client_ip(request))
            raise

class TaskToggleCompleteView(View):
    def post(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
            # Sadece görev sahibi veya admin değiştirebilir
            if task.user == request.user or request.user.is_staff or request.user.is_superuser:
                task.status = 'pending' if task.status == 'completed' else 'completed'
                task.save()
                return JsonResponse({'status': 'success', 'new_status': task.status})
            else:
                return JsonResponse({'status': 'error', 'message': 'Yetkisiz erişim'}, status=403)
        except Task.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Görev bulunamadı'}, status=404)
        except Exception as e:
            ErrorLogger.log_system_error(str(e), get_client_ip(request))
            return JsonResponse({'status': 'error', 'message': 'Sistem hatası'}, status=500)

# UserProfile API Views
class UserProfileListCreateAPI(generics.ListCreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserProfileDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

# Team API Views
class TeamListCreateAPI(generics.ListCreateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

class TeamDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

# TaskComment API Views
class TaskCommentListCreateAPI(generics.ListCreateAPIView):
    queryset = TaskComment.objects.all()
    serializer_class = TaskCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskCommentDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskComment.objects.all()
    serializer_class = TaskCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

# TaskAttachment API Views
class TaskAttachmentListCreateAPI(generics.ListCreateAPIView):
    queryset = TaskAttachment.objects.all()
    serializer_class = TaskAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskAttachmentDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskAttachment.objects.all()
    serializer_class = TaskAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]

# TaskPriority API Views
class TaskPriorityListCreateAPI(generics.ListCreateAPIView):
    queryset = TaskPriority.objects.all()
    serializer_class = TaskPrioritySerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskPriorityDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskPriority.objects.all()
    serializer_class = TaskPrioritySerializer
    permission_classes = [permissions.IsAuthenticated]

# TaskSchedule API Views
class TaskScheduleListCreateAPI(generics.ListCreateAPIView):
    queryset = TaskSchedule.objects.all()
    serializer_class = TaskScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskScheduleDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskSchedule.objects.all()
    serializer_class = TaskScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]

# TaskRecurrence API Views
class TaskRecurrenceListCreateAPI(generics.ListCreateAPIView):
    queryset = TaskRecurrence.objects.all()
    serializer_class = TaskRecurrenceSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskRecurrenceDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskRecurrence.objects.all()
    serializer_class = TaskRecurrenceSerializer
    permission_classes = [permissions.IsAuthenticated]

# TaskDependence API Views
class TaskDependenceListCreateAPI(generics.ListCreateAPIView):
    queryset = TaskDependence.objects.all()
    serializer_class = TaskDependenceSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskDependenceDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskDependence.objects.all()
    serializer_class = TaskDependenceSerializer
    permission_classes = [permissions.IsAuthenticated]

# History API Views
class HistoryListCreateAPI(generics.ListCreateAPIView):
    queryset = History.objects.all()
    serializer_class = HistorySerializer
    permission_classes = [permissions.IsAuthenticated]

class HistoryDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = History.objects.all()
    serializer_class = HistorySerializer
    permission_classes = [permissions.IsAuthenticated]

# TaskReport API Views
class TaskReportListCreateAPI(generics.ListCreateAPIView):
    queryset = TaskReport.objects.all()
    serializer_class = TaskReportSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskReportDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = TaskReport.objects.all()
    serializer_class = TaskReportSerializer
    permission_classes = [permissions.IsAuthenticated]

# UserTeams API Views
class UserTeamsListCreateAPI(generics.ListCreateAPIView):
    queryset = UserTeams.objects.all()
    serializer_class = UserTeamsSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserTeamsDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserTeams.objects.all()
    serializer_class = UserTeamsSerializer
    permission_classes = [permissions.IsAuthenticated]

class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'id': user.id,
                'username': user.username,
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def home(request):
    return HttpResponse("Bu proje sadece API tabanlıdır. Frontend için React uygulamasını kullanınız.")
