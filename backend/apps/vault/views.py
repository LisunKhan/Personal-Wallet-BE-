from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.http import HttpResponse
import json
import secrets
import string
import csv
import io

from .models import (
    Category, VaultItem, SecureFile, EmergencyContact,
    EmergencyAccessRequest, AuditLog, PasswordPolicy
)
from .serializers import (
    CategorySerializer, VaultItemSerializer, VaultItemListSerializer,
    SecureFileSerializer, EmergencyContactSerializer, EmergencyAccessRequestSerializer,
    AuditLogSerializer, PasswordPolicySerializer, VaultStatsSerializer,
    ExportDataSerializer, PasswordGeneratorSerializer
)
from .utils import log_user_action, encrypt_data, decrypt_data
from .schemas import (
    category_list_schema, category_create_schema, vault_item_list_schema,
    vault_item_create_schema, vault_item_detail_schema, password_generator_schema,
    vault_stats_schema, emergency_contact_list_schema, emergency_contact_create_schema,
    audit_log_schema, password_policy_schema, password_policy_update_schema,
    export_data_schema, toggle_favorite_schema
)


class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)
    
    @category_list_schema
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @category_create_schema
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        category = serializer.save()
        log_user_action(
            user=self.request.user,
            action='create_item',
            resource_type='Category',
            resource_id=category.id,
            request=self.request
        )


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        category = serializer.save()
        log_user_action(
            user=self.request.user,
            action='update_item',
            resource_type='Category',
            resource_id=category.id,
            request=self.request
        )
    
    def perform_destroy(self, instance):
        log_user_action(
            user=self.request.user,
            action='delete_item',
            resource_type='Category',
            resource_id=instance.id,
            request=self.request
        )
        instance.delete()


class VaultItemListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return VaultItemListSerializer
        return VaultItemSerializer
    
    def get_queryset(self):
        queryset = VaultItem.objects.filter(user=self.request.user)
        
        # Filtering
        item_type = self.request.query_params.get('type')
        category_id = self.request.query_params.get('category')
        is_favorite = self.request.query_params.get('favorite')
        search = self.request.query_params.get('search')
        
        if item_type:
            queryset = queryset.filter(item_type=item_type)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if is_favorite:
            queryset = queryset.filter(is_favorite=is_favorite.lower() == 'true')
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        return queryset
    
    @vault_item_list_schema
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @vault_item_create_schema
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        vault_item = serializer.save()
        log_user_action(
            user=self.request.user,
            action='create_item',
            resource_type='VaultItem',
            resource_id=vault_item.id,
            request=self.request,
            details={'item_type': vault_item.item_type}
        )


class VaultItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VaultItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return VaultItem.objects.filter(user=self.request.user)
    
    @vault_item_detail_schema
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Update last_used timestamp
        instance.last_used = timezone.now()
        instance.save(update_fields=['last_used'])
        
        log_user_action(
            user=request.user,
            action='view_item',
            resource_type='VaultItem',
            resource_id=instance.id,
            request=request
        )
        
        return super().retrieve(request, *args, **kwargs)
    
    def perform_update(self, serializer):
        vault_item = serializer.save()
        log_user_action(
            user=self.request.user,
            action='update_item',
            resource_type='VaultItem',
            resource_id=vault_item.id,
            request=self.request
        )
    
    def perform_destroy(self, instance):
        log_user_action(
            user=self.request.user,
            action='delete_item',
            resource_type='VaultItem',
            resource_id=instance.id,
            request=self.request
        )
        instance.delete()


class PasswordGeneratorView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    @password_generator_schema
    def post(self, request):
        serializer = PasswordGeneratorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        length = serializer.validated_data['length']
        include_uppercase = serializer.validated_data['include_uppercase']
        include_lowercase = serializer.validated_data['include_lowercase']
        include_numbers = serializer.validated_data['include_numbers']
        include_symbols = serializer.validated_data['include_symbols']
        exclude_ambiguous = serializer.validated_data['exclude_ambiguous']
        
        # Build character set
        chars = ""
        if include_lowercase:
            chars += string.ascii_lowercase
        if include_uppercase:
            chars += string.ascii_uppercase
        if include_numbers:
            chars += string.digits
        if include_symbols:
            chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"
        
        if exclude_ambiguous:
            # Remove ambiguous characters
            ambiguous = "0O1lI"
            chars = ''.join(c for c in chars if c not in ambiguous)
        
        if not chars:
            return Response(
                {'error': 'At least one character type must be selected'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate password
        password = ''.join(secrets.choice(chars) for _ in range(length))
        
        return Response({'password': password})


class VaultStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    @vault_stats_schema
    def get(self, request):
        user = request.user
        
        # Get counts by type
        items = VaultItem.objects.filter(user=user)
        stats = {
            'total_items': items.count(),
            'passwords_count': items.filter(item_type='password').count(),
            'documents_count': items.filter(item_type='document').count(),
            'notes_count': items.filter(item_type='note').count(),
            'cards_count': items.filter(item_type='card').count(),
            'identities_count': items.filter(item_type='identity').count(),
            'weak_passwords': items.filter(password_strength__lt=50).count(),
            'compromised_passwords': items.filter(is_compromised=True).count(),
            'duplicate_passwords': 0,  # TODO: Implement duplicate detection
            'categories_count': Category.objects.filter(user=user).count(),
            'storage_used': 0,  # TODO: Calculate actual storage used
        }
        
        serializer = VaultStatsSerializer(stats)
        return Response(serializer.data)


class EmergencyContactListCreateView(generics.ListCreateAPIView):
    serializer_class = EmergencyContactSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return EmergencyContact.objects.filter(user=self.request.user)
    
    @emergency_contact_list_schema
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @emergency_contact_create_schema
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class EmergencyContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EmergencyContactSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return EmergencyContact.objects.filter(user=self.request.user)


class AuditLogListView(generics.ListAPIView):
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return AuditLog.objects.filter(user=self.request.user)[:100]  # Last 100 logs
    
    @audit_log_schema
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class PasswordPolicyView(generics.RetrieveUpdateAPIView):
    serializer_class = PasswordPolicySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        policy, created = PasswordPolicy.objects.get_or_create(user=self.request.user)
        return policy
    
    @password_policy_schema
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @password_policy_update_schema
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)


class ExportDataView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    @export_data_schema
    def post(self, request):
        serializer = ExportDataSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        export_format = serializer.validated_data['format']
        
        # Get items based on what user wants to export
        items = VaultItem.objects.filter(user=user)
        
        if not serializer.validated_data['include_passwords']:
            items = items.exclude(item_type='password')
        if not serializer.validated_data['include_documents']:
            items = items.exclude(item_type='document')
        if not serializer.validated_data['include_notes']:
            items = items.exclude(item_type='note')
        if not serializer.validated_data['include_cards']:
            items = items.exclude(item_type='card')
        if not serializer.validated_data['include_identities']:
            items = items.exclude(item_type='identity')
        
        # Log export action
        log_user_action(
            user=user,
            action='export_data',
            request=request,
            details={'format': export_format, 'items_count': items.count()}
        )
        
        if export_format == 'json':
            return self._export_json(items)
        else:
            return self._export_csv(items)
    
    def _export_json(self, items):
        data = []
        for item in items:
            data.append({
                'id': str(item.id),
                'name': item.name,
                'type': item.item_type,
                'category': item.category.name if item.category else None,
                'encrypted_data': item.encrypted_data,
                'tags': item.tags,
                'created_at': item.created_at.isoformat(),
                'updated_at': item.updated_at.isoformat(),
            })
        
        response = HttpResponse(
            json.dumps(data, indent=2),
            content_type='application/json'
        )
        response['Content-Disposition'] = 'attachment; filename="vault_export.json"'
        return response
    
    def _export_csv(self, items):
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['ID', 'Name', 'Type', 'Category', 'Tags', 'Created', 'Updated'])
        
        # Write data
        for item in items:
            writer.writerow([
                str(item.id),
                item.name,
                item.item_type,
                item.category.name if item.category else '',
                ', '.join(item.tags),
                item.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                item.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
            ])
        
        response = HttpResponse(output.getvalue(), content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="vault_export.csv"'
        return response


@toggle_favorite_schema
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_favorite(request, item_id):
    """Toggle favorite status of a vault item"""
    try:
        item = VaultItem.objects.get(id=item_id, user=request.user)
        item.is_favorite = not item.is_favorite
        item.save()
        
        log_user_action(
            user=request.user,
            action='update_item',
            resource_type='VaultItem',
            resource_id=item.id,
            request=request,
            details={'action': 'toggle_favorite', 'is_favorite': item.is_favorite}
        )
        
        return Response({'is_favorite': item.is_favorite})
    except VaultItem.DoesNotExist:
        return Response(
            {'error': 'Item not found'},
            status=status.HTTP_404_NOT_FOUND
        )