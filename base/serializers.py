from rest_framework import serializers
from .models import (
    Task, UserProfile, Team, TaskComment, TaskAttachment, TaskPriority, TaskSchedule, TaskRecurrence, TaskDependence, History, TaskReport, UserTeams
)
from django.contrib.auth.models import User
from datetime import date

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

    def validate_title(self, value):
        """Title validation"""
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Başlık en az 3 karakter olmalıdır.")
        if len(value) > 255:
            raise serializers.ValidationError("Başlık en fazla 255 karakter olabilir.")
        return value.strip()

    def validate_description(self, value):
        """Description validation"""
        if value and len(value.strip()) < 3:
            raise serializers.ValidationError("Açıklama en az 3 karakter olmalıdır.")
        return value.strip() if value else value

    def validate_due_date(self, value):
        """Due date validation"""
        if value and value < date.today():
            raise serializers.ValidationError("Bitiş tarihi geçmiş bir tarih olamaz.")
        return value

    def validate_status(self, value):
        """Status validation"""
        valid_statuses = ['pending', 'in_progress', 'completed', 'cancelled']
        if value not in valid_statuses:
            raise serializers.ValidationError(f"Geçersiz durum. Geçerli değerler: {', '.join(valid_statuses)}")
        return value

    def validate_priority(self, value):
        """Priority validation"""
        valid_priorities = ['low', 'medium', 'high', 'critical']
        if value not in valid_priorities:
            raise serializers.ValidationError(f"Geçersiz öncelik. Geçerli değerler: {', '.join(valid_priorities)}")
        return value

    def validate(self, data):
        """Cross-field validation"""
        # Eğer görev tamamlandıysa, öncelik kontrolü
        if data.get('status') == 'completed' and data.get('priority') == 'critical':
            raise serializers.ValidationError("Kritik öncelikli görevler tamamlandı olarak işaretlenemez.")
        
        # Bitiş tarihi kontrolü
        if data.get('due_date') and data.get('status') == 'completed':
            if data['due_date'] < date.today():
                raise serializers.ValidationError("Geçmiş tarihli görevler tamamlandı olarak işaretlenemez.")
        
        return data

class TaskCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskComment
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

    def validate_comment(self, value):
        """Comment validation"""
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Yorum en az 5 karakter olmalıdır.")
        return value.strip()

class TaskAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskAttachment
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def validate_file_name(self, value):
        """File name validation"""
        if len(value.strip()) < 1:
            raise serializers.ValidationError("Dosya adı boş olamaz.")
        return value.strip()

class TaskPrioritySerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskPriority
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def validate_name(self, value):
        """Priority name validation"""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Öncelik adı en az 2 karakter olmalıdır.")
        return value.strip()

class TaskScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskSchedule
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def validate_schedule_date(self, value):
        """Schedule date validation"""
        if value and value < date.today():
            raise serializers.ValidationError("Planlama tarihi geçmiş bir tarih olamaz.")
        return value

    def validate_reminder_date(self, value):
        """Reminder date validation"""
        if value and value < date.today():
            raise serializers.ValidationError("Hatırlatma tarihi geçmiş bir tarih olamaz.")
        return value

class TaskRecurrenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskRecurrence
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def validate_recurrence_type(self, value):
        """Recurrence type validation"""
        valid_types = ['daily', 'weekly', 'monthly', 'yearly']
        if value not in valid_types:
            raise serializers.ValidationError(f"Geçersiz tekrar tipi. Geçerli değerler: {', '.join(valid_types)}")
        return value

class TaskDependenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskDependence
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, data):
        """Cross-field validation for task dependence"""
        if data.get('task') == data.get('dependent_task'):
            raise serializers.ValidationError("Görev kendisine bağımlı olamaz.")
        return data

class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = '__all__'
        read_only_fields = ['updated_at']

    def validate_task_name(self, value):
        """Task name validation"""
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Görev adı en az 3 karakter olmalıdır.")
        return value.strip()

class TaskReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskReport
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

    def validate_report_type(self, value):
        """Report type validation"""
        valid_types = ['daily', 'weekly', 'monthly', 'custom']
        if value not in valid_types:
            raise serializers.ValidationError(f"Geçersiz rapor tipi. Geçerli değerler: {', '.join(valid_types)}")
        return value

class UserTeamsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTeams
        fields = '__all__'
        read_only_fields = ['created_at']

    def validate(self, data):
        """Cross-field validation for user teams"""
        # Aynı kullanıcı aynı takıma birden fazla kez eklenemez
        if UserTeams.objects.filter(user=data.get('user'), team=data.get('team')).exists():
            raise serializers.ValidationError("Bu kullanıcı zaten bu takımda bulunuyor.")
        return data 