from django.contrib import admin
from .models import (
    Task, UserProfile, Team, TaskComment, TaskAttachment, TaskPriority, TaskSchedule, TaskRecurrence, TaskDependence, History, TaskReport, UserTeams, Log
)

@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
    list_display = ['timestamp', 'level', 'log_type', 'user', 'action', 'ip_address']
    list_filter = ['level', 'log_type', 'timestamp', 'user']
    search_fields = ['action', 'details', 'user__username', 'ip_address']
    readonly_fields = ['timestamp', 'level', 'log_type', 'user', 'ip_address', 'action', 'details']
    ordering = ['-timestamp']
    
    def has_add_permission(self, request):
        return False  # Log kayıtları manuel olarak eklenemez
    
    def has_change_permission(self, request, obj=None):
        return False  # Log kayıtları değiştirilemez
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser  # Sadece superuser silebilir

admin.site.register(Task)
admin.site.register(UserProfile)
admin.site.register(Team)
admin.site.register(TaskComment)
admin.site.register(TaskAttachment)
admin.site.register(TaskPriority)
admin.site.register(TaskSchedule)
admin.site.register(TaskRecurrence)
admin.site.register(TaskDependence)
admin.site.register(History)
admin.site.register(TaskReport)
admin.site.register(UserTeams)
