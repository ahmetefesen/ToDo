from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import (
    Task, UserProfile, Team, TaskComment, TaskAttachment, TaskPriority, TaskSchedule, TaskRecurrence, TaskDependence, History, TaskReport, UserTeams, Log
)

class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined', 'jwt_access_token_short', 'jwt_refresh_token_short']
    list_filter = ['is_staff', 'is_active', 'is_superuser', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    readonly_fields = ['date_joined', 'last_login', 'jwt_access_token', 'jwt_refresh_token']
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Kişisel Bilgiler', {'fields': ('first_name', 'last_name', 'email')}),
        ('İzinler', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Önemli Tarihler', {'fields': ('last_login', 'date_joined')}),
        ('JWT Token Bilgileri', {'fields': ('jwt_access_token', 'jwt_refresh_token')}),
    )
    
    def jwt_access_token(self, obj):
        """Kullanıcının access token'ını göster"""
        try:
            refresh = RefreshToken.for_user(obj)
            return str(refresh.access_token)
        except Exception as e:
            return f"Token oluşturulamadı: {str(e)}"
    jwt_access_token.short_description = 'JWT Access Token'
    
    def jwt_refresh_token(self, obj):
        """Kullanıcının refresh token'ını göster"""
        try:
            refresh = RefreshToken.for_user(obj)
            return str(refresh)
        except Exception as e:
            return f"Token oluşturulamadı: {str(e)}"
    jwt_refresh_token.short_description = 'JWT Refresh Token'
    
    def jwt_access_token_short(self, obj):
        """Kısa access token gösterimi (liste için)"""
        try:
            refresh = RefreshToken.for_user(obj)
            token = str(refresh.access_token)
            return token[:20] + "..." if len(token) > 20 else token
        except Exception as e:
            return "Hata"
    jwt_access_token_short.short_description = 'Access Token'
    
    def jwt_refresh_token_short(self, obj):
        """Kısa refresh token gösterimi (liste için)"""
        try:
            refresh = RefreshToken.for_user(obj)
            token = str(refresh)
            return token[:20] + "..." if len(token) > 20 else token
        except Exception as e:
            return "Hata"
    jwt_refresh_token_short.short_description = 'Refresh Token'

# Mevcut User admin'ini kaldır ve yenisini kaydet
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

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
