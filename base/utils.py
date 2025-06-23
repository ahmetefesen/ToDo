from .models import Log
from django.contrib.auth.models import User
import logging

logger = logging.getLogger(__name__)

class LogManager:
    """Logging işlemleri için merkezi yönetici sınıf"""
    
    @staticmethod
    def log_security_event(level, action, details, user=None, ip_address=None):
        """Güvenlik olaylarını kaydet"""
        try:
            Log.objects.create(
                level=level,
                log_type='SECURITY',
                user=user,
                ip_address=ip_address,
                action=action,
                details=details
            )
            # Django logger'a da yaz
            if level == 'ERROR':
                logger.error(f"SECURITY ERROR: {action} - {details}")
            elif level == 'WARNING':
                logger.warning(f"SECURITY WARNING: {action} - {details}")
            else:
                logger.info(f"SECURITY INFO: {action} - {details}")
        except Exception as e:
            logger.error(f"Log kayıt hatası: {e}")
    
    @staticmethod
    def log_operation_event(level, action, details, user=None, ip_address=None):
        """İşlem olaylarını kaydet"""
        try:
            Log.objects.create(
                level=level,
                log_type='OPERATION',
                user=user,
                ip_address=ip_address,
                action=action,
                details=details
            )
            # Django logger'a da yaz
            if level == 'ERROR':
                logger.error(f"OPERATION ERROR: {action} - {details}")
            elif level == 'WARNING':
                logger.warning(f"OPERATION WARNING: {action} - {details}")
            else:
                logger.info(f"OPERATION INFO: {action} - {details}")
        except Exception as e:
            logger.error(f"Log kayıt hatası: {e}")
    
    @staticmethod
    def log_error_event(level, action, details, user=None, ip_address=None):
        """Hata olaylarını kaydet"""
        try:
            Log.objects.create(
                level=level,
                log_type='ERROR',
                user=user,
                ip_address=ip_address,
                action=action,
                details=details
            )
            # Django logger'a da yaz
            logger.error(f"SYSTEM ERROR: {action} - {details}")
        except Exception as e:
            logger.error(f"Log kayıt hatası: {e}")

class SecurityLogger:
    """Güvenlik olayları için özel logger"""
    
    @staticmethod
    def log_login_success(user, ip_address):
        """Başarılı login kaydı"""
        LogManager.log_security_event(
            'INFO',
            'Başarılı Giriş',
            f"Kullanıcı '{user.username}' başarıyla giriş yaptı",
            user,
            ip_address
        )
    
    @staticmethod
    def log_login_failure(username, ip_address, reason="Bilinmeyen hata"):
        """Başarısız login kaydı"""
        LogManager.log_security_event(
            'WARNING',
            'Başarısız Giriş Denemesi',
            f"Kullanıcı '{username}' giriş yapamadı. Sebep: {reason}",
            None,
            ip_address
        )
    
    @staticmethod
    def log_logout(user, ip_address):
        """Logout kaydı"""
        LogManager.log_security_event(
            'INFO',
            'Çıkış',
            f"Kullanıcı '{user.username}' çıkış yaptı",
            user,
            ip_address
        )
    
    @staticmethod
    def log_unauthorized_access(user, ip_address, resource):
        """Yetkisiz erişim kaydı"""
        LogManager.log_security_event(
            'WARNING',
            'Yetkisiz Erişim Denemesi',
            f"Kullanıcı '{user.username if user else 'Anonim'}' {resource} kaynağına erişmeye çalıştı",
            user,
            ip_address
        )

class OperationLogger:
    """İşlem olayları için özel logger"""
    
    @staticmethod
    def log_task_created(user, task_title, ip_address):
        """Görev oluşturma kaydı"""
        LogManager.log_operation_event(
            'INFO',
            'Görev Oluşturuldu',
            f"Kullanıcı '{user.username}' '{task_title}' görevini oluşturdu",
            user,
            ip_address
        )
    
    @staticmethod
    def log_task_updated(user, task_title, changes, ip_address):
        """Görev güncelleme kaydı"""
        LogManager.log_operation_event(
            'INFO',
            'Görev Güncellendi',
            f"Kullanıcı '{user.username}' '{task_title}' görevini güncelledi. Değişiklikler: {changes}",
            user,
            ip_address
        )
    
    @staticmethod
    def log_task_deleted(user, task_title, ip_address):
        """Görev silme kaydı"""
        LogManager.log_operation_event(
            'WARNING',
            'Görev Silindi',
            f"Kullanıcı '{user.username}' '{task_title}' görevini sildi",
            user,
            ip_address
        )
    
    @staticmethod
    def log_api_access(user, endpoint, method, ip_address):
        """API erişim kaydı"""
        LogManager.log_operation_event(
            'INFO',
            'API Erişimi',
            f"Kullanıcı '{user.username if user else 'Anonim'}' {method} {endpoint} endpoint'ine erişti",
            user,
            ip_address
        )

class ErrorLogger:
    """Hata olayları için özel logger"""
    
    @staticmethod
    def log_validation_error(user, field, error_message, ip_address):
        """Validation hatası kaydı"""
        LogManager.log_error_event(
            'WARNING',
            'Veri Doğrulama Hatası',
            f"Kullanıcı '{user.username if user else 'Anonim'}' {field} alanında hata: {error_message}",
            user,
            ip_address
        )
    
    @staticmethod
    def log_database_error(user, operation, error_message, ip_address):
        """Veritabanı hatası kaydı"""
        LogManager.log_error_event(
            'ERROR',
            'Veritabanı Hatası',
            f"Kullanıcı '{user.username if user else 'Anonim'}' {operation} işleminde veritabanı hatası: {error_message}",
            user,
            ip_address
        )
    
    @staticmethod
    def log_system_error(error_message, ip_address=None):
        """Sistem hatası kaydı"""
        LogManager.log_error_event(
            'CRITICAL',
            'Sistem Hatası',
            f"Sistem hatası: {error_message}",
            None,
            ip_address
        ) 