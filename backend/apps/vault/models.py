from django.db import models
from django.contrib.auth import get_user_model
import uuid
from django.core.validators import FileExtensionValidator

User = get_user_model()

class Category(models.Model):
    """Categories for organizing vault items"""
    CATEGORY_TYPES = [
        ('password', 'Password'),
        ('document', 'Document'),
        ('note', 'Note'),
        ('card', 'Payment Card'),
        ('identity', 'Identity'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)
    category_type = models.CharField(max_length=20, choices=CATEGORY_TYPES)
    icon = models.CharField(max_length=50, default='folder')
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'name', 'category_type']
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.category_type})"


class VaultItem(models.Model):
    """Base model for all vault items"""
    ITEM_TYPES = [
        ('password', 'Password'),
        ('document', 'Document'),
        ('note', 'Secure Note'),
        ('card', 'Payment Card'),
        ('identity', 'Identity'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vault_items')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    
    name = models.CharField(max_length=255)
    item_type = models.CharField(max_length=20, choices=ITEM_TYPES)
    
    # Encrypted data - all sensitive data stored as encrypted JSON
    encrypted_data = models.TextField()  # JSON string of encrypted data
    
    # Metadata
    is_favorite = models.BooleanField(default=False)
    tags = models.JSONField(default=list, blank=True)
    
    # Security
    password_strength = models.IntegerField(null=True, blank=True)  # 0-100 score
    is_compromised = models.BooleanField(default=False)
    last_used = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['user', 'item_type']),
            models.Index(fields=['user', 'is_favorite']),
            models.Index(fields=['user', 'category']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.item_type})"


class SecureFile(models.Model):
    """Encrypted file storage for documents"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vault_item = models.ForeignKey(VaultItem, on_delete=models.CASCADE, related_name='files')
    
    original_filename = models.CharField(max_length=255)
    file_size = models.BigIntegerField()  # Size in bytes
    mime_type = models.CharField(max_length=100)
    
    # Encrypted file stored in secure location
    encrypted_file_path = models.CharField(max_length=500)
    
    # File metadata
    checksum = models.CharField(max_length=64)  # SHA-256 checksum
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.original_filename} ({self.vault_item.name})"


class EmergencyContact(models.Model):
    """Emergency access contacts"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='emergency_contacts')
    
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    
    # Access settings
    access_delay_days = models.IntegerField(default=7)  # Days before access is granted
    can_access_passwords = models.BooleanField(default=True)
    can_access_documents = models.BooleanField(default=False)
    can_access_notes = models.BooleanField(default=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'email']
    
    def __str__(self):
        return f"{self.name} - {self.email}"


class EmergencyAccessRequest(models.Model):
    """Emergency access requests"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('denied', 'Denied'),
        ('expired', 'Expired'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    emergency_contact = models.ForeignKey(EmergencyContact, on_delete=models.CASCADE)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    requested_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField()
    
    # Verification
    verification_code = models.CharField(max_length=100)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    
    def __str__(self):
        return f"Emergency access for {self.emergency_contact.user.email}"


class AuditLog(models.Model):
    """Security audit logs"""
    ACTION_TYPES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('create_item', 'Create Item'),
        ('update_item', 'Update Item'),
        ('delete_item', 'Delete Item'),
        ('view_item', 'View Item'),
        ('export_data', 'Export Data'),
        ('emergency_access', 'Emergency Access'),
        ('password_change', 'Password Change'),
        ('device_added', 'Device Added'),
        ('device_removed', 'Device Removed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='audit_logs')
    
    action = models.CharField(max_length=50, choices=ACTION_TYPES)
    resource_type = models.CharField(max_length=50, blank=True)  # VaultItem, Category, etc.
    resource_id = models.UUIDField(null=True, blank=True)
    
    # Request details
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    device_id = models.CharField(max_length=255, blank=True)
    
    # Additional context
    details = models.JSONField(default=dict, blank=True)
    
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['user', 'action']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.action} at {self.timestamp}"


class PasswordPolicy(models.Model):
    """User's password policy settings"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='password_policy')
    
    min_length = models.IntegerField(default=12)
    require_uppercase = models.BooleanField(default=True)
    require_lowercase = models.BooleanField(default=True)
    require_numbers = models.BooleanField(default=True)
    require_symbols = models.BooleanField(default=True)
    
    # Security settings
    check_compromised_passwords = models.BooleanField(default=True)
    auto_generate_passwords = models.BooleanField(default=True)
    password_history_count = models.IntegerField(default=5)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Password policy for {self.user.email}"