from rest_framework import serializers
from .models import (
    Category, VaultItem, SecureFile, EmergencyContact, 
    EmergencyAccessRequest, AuditLog, PasswordPolicy
)
import json


class CategorySerializer(serializers.ModelSerializer):
    items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'category_type', 'icon', 'color', 'items_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_items_count(self, obj):
        return obj.vaultitem_set.count()
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class SecureFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecureFile
        fields = ['id', 'original_filename', 'file_size', 'mime_type', 'created_at']
        read_only_fields = ['id', 'created_at']


class VaultItemSerializer(serializers.ModelSerializer):
    files = SecureFileSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = VaultItem
        fields = [
            'id', 'name', 'item_type', 'category', 'category_name', 
            'encrypted_data', 'is_favorite', 'tags', 'password_strength',
            'is_compromised', 'last_used', 'files', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class VaultItemListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing items (without encrypted_data)"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    files_count = serializers.SerializerMethodField()
    
    class Meta:
        model = VaultItem
        fields = [
            'id', 'name', 'item_type', 'category', 'category_name',
            'is_favorite', 'tags', 'password_strength', 'is_compromised',
            'last_used', 'files_count', 'created_at', 'updated_at'
        ]
    
    def get_files_count(self, obj):
        return obj.files.count()


class PasswordGeneratorSerializer(serializers.Serializer):
    """Serializer for password generation requests"""
    length = serializers.IntegerField(min_value=4, max_value=128, default=16)
    include_uppercase = serializers.BooleanField(default=True)
    include_lowercase = serializers.BooleanField(default=True)
    include_numbers = serializers.BooleanField(default=True)
    include_symbols = serializers.BooleanField(default=True)
    exclude_ambiguous = serializers.BooleanField(default=True)


class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = [
            'id', 'name', 'email', 'phone', 'access_delay_days',
            'can_access_passwords', 'can_access_documents', 'can_access_notes',
            'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class EmergencyAccessRequestSerializer(serializers.ModelSerializer):
    emergency_contact_name = serializers.CharField(source='emergency_contact.name', read_only=True)
    user_email = serializers.CharField(source='emergency_contact.user.email', read_only=True)
    
    class Meta:
        model = EmergencyAccessRequest
        fields = [
            'id', 'emergency_contact', 'emergency_contact_name', 'user_email',
            'status', 'requested_at', 'approved_at', 'expires_at'
        ]
        read_only_fields = ['id', 'requested_at', 'approved_at']


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = [
            'id', 'action', 'resource_type', 'resource_id',
            'ip_address', 'user_agent', 'device_id', 'details', 'timestamp'
        ]
        read_only_fields = ['id', 'timestamp']


class PasswordPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = PasswordPolicy
        fields = [
            'min_length', 'require_uppercase', 'require_lowercase',
            'require_numbers', 'require_symbols', 'check_compromised_passwords',
            'auto_generate_passwords', 'password_history_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class VaultStatsSerializer(serializers.Serializer):
    """Serializer for vault statistics"""
    total_items = serializers.IntegerField()
    passwords_count = serializers.IntegerField()
    documents_count = serializers.IntegerField()
    notes_count = serializers.IntegerField()
    cards_count = serializers.IntegerField()
    identities_count = serializers.IntegerField()
    weak_passwords = serializers.IntegerField()
    compromised_passwords = serializers.IntegerField()
    duplicate_passwords = serializers.IntegerField()
    categories_count = serializers.IntegerField()
    storage_used = serializers.IntegerField()  # in bytes


class ExportDataSerializer(serializers.Serializer):
    """Serializer for data export requests"""
    format = serializers.ChoiceField(choices=['json', 'csv'], default='json')
    include_passwords = serializers.BooleanField(default=True)
    include_documents = serializers.BooleanField(default=False)  # Security: documents not exported by default
    include_notes = serializers.BooleanField(default=True)
    include_cards = serializers.BooleanField(default=True)
    include_identities = serializers.BooleanField(default=True)