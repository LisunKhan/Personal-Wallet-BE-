from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, Http404
from django.conf import settings
import os
import hashlib
import uuid
from .models import VaultItem, SecureFile
from .utils import (
    validate_file_type, sanitize_filename, encrypt_data, 
    decrypt_data, log_user_action
)
from .schemas import file_upload_schema, file_download_schema


@file_upload_schema
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_file(request, item_id):
    """
    Upload and encrypt a file for a vault item
    """
    try:
        vault_item = VaultItem.objects.get(id=item_id, user=request.user)
    except VaultItem.DoesNotExist:
        return Response(
            {'error': 'Vault item not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if 'file' not in request.FILES:
        return Response(
            {'error': 'No file provided'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    uploaded_file = request.FILES['file']
    
    try:
        # Validate file
        validate_file_type(uploaded_file)
        
        # Sanitize filename
        safe_filename = sanitize_filename(uploaded_file.name)
        
        # Generate unique filename for storage
        file_extension = os.path.splitext(safe_filename)[1]
        storage_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Create secure storage directory
        storage_dir = os.path.join(settings.MEDIA_ROOT, 'secure_files', str(request.user.id))
        os.makedirs(storage_dir, exist_ok=True)
        
        storage_path = os.path.join(storage_dir, storage_filename)
        
        # Read and encrypt file content
        file_content = uploaded_file.read()
        
        # Calculate checksum
        checksum = hashlib.sha256(file_content).hexdigest()
        
        # Encrypt file content
        encrypted_content = encrypt_data(file_content.decode('latin-1'))  # Use latin-1 for binary data
        
        # Save encrypted file
        with open(storage_path, 'w') as f:
            f.write(encrypted_content)
        
        # Create SecureFile record
        secure_file = SecureFile.objects.create(
            vault_item=vault_item,
            original_filename=safe_filename,
            file_size=uploaded_file.size,
            mime_type=uploaded_file.content_type,
            encrypted_file_path=storage_path,
            checksum=checksum
        )
        
        # Log the action
        log_user_action(
            user=request.user,
            action='create_item',
            resource_type='SecureFile',
            resource_id=secure_file.id,
            request=request,
            details={
                'filename': safe_filename,
                'size': uploaded_file.size,
                'mime_type': uploaded_file.content_type
            }
        )
        
        return Response({
            'id': secure_file.id,
            'filename': secure_file.original_filename,
            'size': secure_file.file_size,
            'mime_type': secure_file.mime_type,
            'created_at': secure_file.created_at
        }, status=status.HTTP_201_CREATED)
        
    except ValueError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': 'File upload failed'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@file_download_schema
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def download_file(request, file_id):
    """
    Download and decrypt a secure file
    """
    try:
        secure_file = SecureFile.objects.get(
            id=file_id,
            vault_item__user=request.user
        )
    except SecureFile.DoesNotExist:
        raise Http404("File not found")
    
    try:
        # Read encrypted file
        with open(secure_file.encrypted_file_path, 'r') as f:
            encrypted_content = f.read()
        
        # Decrypt file content
        decrypted_content = decrypt_data(encrypted_content)
        
        # Convert back to bytes
        file_bytes = decrypted_content.encode('latin-1')
        
        # Verify checksum
        calculated_checksum = hashlib.sha256(file_bytes).hexdigest()
        if calculated_checksum != secure_file.checksum:
            return Response(
                {'error': 'File integrity check failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Log the action
        log_user_action(
            user=request.user,
            action='view_item',
            resource_type='SecureFile',
            resource_id=secure_file.id,
            request=request,
            details={'filename': secure_file.original_filename}
        )
        
        # Return file
        response = HttpResponse(
            file_bytes,
            content_type=secure_file.mime_type
        )
        response['Content-Disposition'] = f'attachment; filename="{secure_file.original_filename}"'
        response['Content-Length'] = secure_file.file_size
        
        return response
        
    except Exception as e:
        return Response(
            {'error': 'File download failed'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_file(request, file_id):
    """
    Delete a secure file
    """
    try:
        secure_file = SecureFile.objects.get(
            id=file_id,
            vault_item__user=request.user
        )
    except SecureFile.DoesNotExist:
        return Response(
            {'error': 'File not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    try:
        # Delete physical file
        if os.path.exists(secure_file.encrypted_file_path):
            os.remove(secure_file.encrypted_file_path)
        
        # Log the action
        log_user_action(
            user=request.user,
            action='delete_item',
            resource_type='SecureFile',
            resource_id=secure_file.id,
            request=request,
            details={'filename': secure_file.original_filename}
        )
        
        # Delete database record
        secure_file.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
        
    except Exception as e:
        return Response(
            {'error': 'File deletion failed'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )