from django.contrib import admin
from .models import (
    Category, VaultItem, SecureFile, EmergencyContact,
    EmergencyAccessRequest, AuditLog, PasswordPolicy
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'category_type', 'user', 'created_at']
    list_filter = ['category_type', 'created_at']
    search_fields = ['name', 'user__email']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(VaultItem)
class VaultItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'item_type', 'user', 'category', 'is_favorite', 'created_at']
    list_filter = ['item_type', 'is_favorite', 'is_compromised', 'created_at']
    search_fields = ['name', 'user__email']
    readonly_fields = ['id', 'created_at', 'updated_at', 'last_used']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'category')


@admin.register(SecureFile)
class SecureFileAdmin(admin.ModelAdmin):
    list_display = ['original_filename', 'vault_item', 'file_size', 'mime_type', 'created_at']
    list_filter = ['mime_type', 'created_at']
    search_fields = ['original_filename', 'vault_item__name']
    readonly_fields = ['id', 'created_at', 'checksum']


@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'user', 'access_delay_days', 'is_active', 'created_at']
    list_filter = ['is_active', 'access_delay_days', 'created_at']
    search_fields = ['name', 'email', 'user__email']
    readonly_fields = ['id', 'created_at']


@admin.register(EmergencyAccessRequest)
class EmergencyAccessRequestAdmin(admin.ModelAdmin):
    list_display = ['emergency_contact', 'status', 'requested_at', 'expires_at']
    list_filter = ['status', 'requested_at']
    search_fields = ['emergency_contact__name', 'emergency_contact__email']
    readonly_fields = ['id', 'requested_at', 'verification_code']


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'resource_type', 'ip_address', 'timestamp']
    list_filter = ['action', 'resource_type', 'timestamp']
    search_fields = ['user__email', 'ip_address']
    readonly_fields = ['id', 'timestamp']
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False


@admin.register(PasswordPolicy)
class PasswordPolicyAdmin(admin.ModelAdmin):
    list_display = ['user', 'min_length', 'require_uppercase', 'require_numbers', 'created_at']
    list_filter = ['require_uppercase', 'require_lowercase', 'require_numbers', 'require_symbols']
    search_fields = ['user__email']
    readonly_fields = ['created_at', 'updated_at']