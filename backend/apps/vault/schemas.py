from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse, OpenApiParameter
from drf_spectacular.openapi import AutoSchema
from rest_framework import status
from .serializers import (
    CategorySerializer, VaultItemSerializer, VaultItemListSerializer,
    SecureFileSerializer, EmergencyContactSerializer, EmergencyAccessRequestSerializer,
    AuditLogSerializer, PasswordPolicySerializer, VaultStatsSerializer,
    ExportDataSerializer, PasswordGeneratorSerializer
)


# Category Schemas
category_list_schema = extend_schema(
    tags=['Categories'],
    summary='List user categories',
    description='Get all categories for the authenticated user with item counts.',
    responses={
        200: OpenApiResponse(
            response=CategorySerializer(many=True),
            description='List of categories',
            examples=[
                OpenApiExample(
                    'Categories List',
                    value=[
                        {
                            'id': '123e4567-e89b-12d3-a456-426614174000',
                            'name': 'Personal',
                            'category_type': 'password',
                            'icon': 'user',
                            'color': '#3B82F6',
                            'items_count': 5,
                            'created_at': '2024-01-01T00:00:00Z',
                            'updated_at': '2024-01-01T00:00:00Z'
                        }
                    ]
                )
            ]
        )
    }
)

category_create_schema = extend_schema(
    tags=['Categories'],
    summary='Create new category',
    description='Create a new category for organizing vault items.',
    request=CategorySerializer,
    responses={
        201: OpenApiResponse(
            response=CategorySerializer,
            description='Category created successfully'
        ),
        400: OpenApiResponse(
            description='Bad Request - Invalid data',
            examples=[
                OpenApiExample(
                    'Validation Error',
                    value={
                        'name': ['This field is required.'],
                        'category_type': ['This field is required.']
                    }
                )
            ]
        )
    },
    examples=[
        OpenApiExample(
            'Create Category',
            value={
                'name': 'Work Accounts',
                'category_type': 'password',
                'icon': 'briefcase',
                'color': '#10B981'
            },
            request_only=True
        )
    ]
)

# Vault Item Schemas
vault_item_list_schema = extend_schema(
    tags=['Vault Items'],
    summary='List vault items',
    description='Get all vault items for the authenticated user with filtering options.',
    parameters=[
        OpenApiParameter(
            name='type',
            description='Filter by item type',
            required=False,
            type=str,
            enum=['password', 'document', 'note', 'card', 'identity']
        ),
        OpenApiParameter(
            name='category',
            description='Filter by category ID',
            required=False,
            type=str
        ),
        OpenApiParameter(
            name='favorite',
            description='Filter favorites',
            required=False,
            type=bool
        ),
        OpenApiParameter(
            name='search',
            description='Search by name',
            required=False,
            type=str
        ),
    ],
    responses={
        200: OpenApiResponse(
            response=VaultItemListSerializer(many=True),
            description='List of vault items (without encrypted_data)',
            examples=[
                OpenApiExample(
                    'Vault Items List',
                    value=[
                        {
                            'id': '123e4567-e89b-12d3-a456-426614174000',
                            'name': 'Gmail Account',
                            'item_type': 'password',
                            'category': '123e4567-e89b-12d3-a456-426614174001',
                            'category_name': 'Personal',
                            'is_favorite': False,
                            'tags': ['email', 'google'],
                            'password_strength': 85,
                            'is_compromised': False,
                            'last_used': '2024-01-01T00:00:00Z',
                            'files_count': 0,
                            'created_at': '2024-01-01T00:00:00Z',
                            'updated_at': '2024-01-01T00:00:00Z'
                        }
                    ]
                )
            ]
        )
    }
)

vault_item_create_schema = extend_schema(
    tags=['Vault Items'],
    summary='Create vault item',
    description='''
    Create a new vault item (password, document, note, card, or identity).
    
    **Security Note**: The encrypted_data field should contain client-side encrypted JSON 
    with the sensitive information. The server never sees unencrypted data.
    ''',
    request=VaultItemSerializer,
    responses={
        201: OpenApiResponse(
            response=VaultItemSerializer,
            description='Vault item created successfully'
        ),
        400: OpenApiResponse(
            description='Bad Request - Invalid data'
        )
    },
    examples=[
        OpenApiExample(
            'Create Password Item',
            value={
                'name': 'Gmail Account',
                'item_type': 'password',
                'category': '123e4567-e89b-12d3-a456-426614174001',
                'encrypted_data': 'encrypted_json_string_here',
                'tags': ['email', 'google']
            },
            request_only=True
        )
    ]
)

vault_item_detail_schema = extend_schema(
    tags=['Vault Items'],
    summary='Get vault item details',
    description='Get a specific vault item with encrypted data. Updates last_used timestamp.',
    responses={
        200: OpenApiResponse(
            response=VaultItemSerializer,
            description='Vault item details with encrypted data'
        ),
        404: OpenApiResponse(
            description='Vault item not found'
        )
    }
)

# Password Generator Schema
password_generator_schema = extend_schema(
    tags=['Password Tools'],
    summary='Generate secure password',
    description='Generate a cryptographically secure password with customizable options.',
    request=PasswordGeneratorSerializer,
    responses={
        200: OpenApiResponse(
            description='Generated password',
            examples=[
                OpenApiExample(
                    'Generated Password',
                    value={
                        'password': 'Kx9#mP2$vL8@nQ5!'
                    }
                )
            ]
        ),
        400: OpenApiResponse(
            description='Bad Request - Invalid parameters',
            examples=[
                OpenApiExample(
                    'No Character Types Selected',
                    value={
                        'error': 'At least one character type must be selected'
                    }
                )
            ]
        )
    },
    examples=[
        OpenApiExample(
            'Password Generation Request',
            value={
                'length': 16,
                'include_uppercase': True,
                'include_lowercase': True,
                'include_numbers': True,
                'include_symbols': True,
                'exclude_ambiguous': True
            },
            request_only=True
        )
    ]
)

# Vault Stats Schema
vault_stats_schema = extend_schema(
    tags=['Statistics'],
    summary='Get vault statistics',
    description='Get comprehensive statistics about the user\'s vault including security metrics.',
    responses={
        200: OpenApiResponse(
            response=VaultStatsSerializer,
            description='Vault statistics',
            examples=[
                OpenApiExample(
                    'Vault Statistics',
                    value={
                        'total_items': 25,
                        'passwords_count': 15,
                        'documents_count': 5,
                        'notes_count': 3,
                        'cards_count': 2,
                        'identities_count': 0,
                        'weak_passwords': 2,
                        'compromised_passwords': 0,
                        'duplicate_passwords': 1,
                        'categories_count': 8,
                        'storage_used': 5242880
                    }
                )
            ]
        )
    }
)

# Emergency Contact Schemas
emergency_contact_list_schema = extend_schema(
    tags=['Emergency Access'],
    summary='List emergency contacts',
    description='Get all emergency contacts for the authenticated user.',
    responses={
        200: OpenApiResponse(
            response=EmergencyContactSerializer(many=True),
            description='List of emergency contacts'
        )
    }
)

emergency_contact_create_schema = extend_schema(
    tags=['Emergency Access'],
    summary='Create emergency contact',
    description='''
    Create a new emergency contact who can request access to your vault in emergencies.
    
    **Security Note**: Emergency access is subject to a time delay (default 7 days) 
    and limited permissions based on your settings.
    ''',
    request=EmergencyContactSerializer,
    responses={
        201: OpenApiResponse(
            response=EmergencyContactSerializer,
            description='Emergency contact created successfully'
        )
    },
    examples=[
        OpenApiExample(
            'Create Emergency Contact',
            value={
                'name': 'John Doe',
                'email': 'john@example.com',
                'phone': '+1234567890',
                'access_delay_days': 7,
                'can_access_passwords': True,
                'can_access_documents': False,
                'can_access_notes': True
            },
            request_only=True
        )
    ]
)

# File Upload Schema
file_upload_schema = extend_schema(
    tags=['Files'],
    summary='Upload secure file',
    description='''
    Upload and encrypt a file for a vault item.
    
    **Security Note**: Files are encrypted before storage and can only be 
    decrypted by the authenticated user.
    
    **Supported file types**: PDF, images (JPEG, PNG, GIF), text files, 
    Microsoft Office documents.
    
    **Maximum file size**: 10MB
    ''',
    request={
        'multipart/form-data': {
            'type': 'object',
            'properties': {
                'file': {
                    'type': 'string',
                    'format': 'binary',
                    'description': 'File to upload'
                }
            }
        }
    },
    responses={
        201: OpenApiResponse(
            description='File uploaded successfully',
            examples=[
                OpenApiExample(
                    'Upload Success',
                    value={
                        'id': '123e4567-e89b-12d3-a456-426614174000',
                        'filename': 'document.pdf',
                        'size': 1024000,
                        'mime_type': 'application/pdf',
                        'created_at': '2024-01-01T00:00:00Z'
                    }
                )
            ]
        ),
        400: OpenApiResponse(
            description='Bad Request - Invalid file',
            examples=[
                OpenApiExample(
                    'File Type Not Allowed',
                    value={
                        'error': 'File type application/exe not allowed'
                    }
                ),
                OpenApiExample(
                    'File Too Large',
                    value={
                        'error': 'File size 15728640 exceeds maximum allowed size'
                    }
                )
            ]
        ),
        404: OpenApiResponse(
            description='Vault item not found'
        )
    }
)

# File Download Schema
file_download_schema = extend_schema(
    tags=['Files'],
    summary='Download secure file',
    description='''
    Download and decrypt a secure file.
    
    **Security Note**: File integrity is verified using SHA-256 checksum 
    before download. Access is logged for security audit.
    ''',
    responses={
        200: OpenApiResponse(
            description='File downloaded successfully',
            examples=[
                OpenApiExample(
                    'File Download',
                    value='Binary file content',
                    media_type='application/octet-stream'
                )
            ]
        ),
        404: OpenApiResponse(
            description='File not found'
        ),
        500: OpenApiResponse(
            description='File integrity check failed or decryption error'
        )
    }
)

# Audit Log Schema
audit_log_schema = extend_schema(
    tags=['Security & Audit'],
    summary='Get audit logs',
    description='Get recent security audit logs for the authenticated user (last 100 entries).',
    responses={
        200: OpenApiResponse(
            response=AuditLogSerializer(many=True),
            description='List of audit log entries',
            examples=[
                OpenApiExample(
                    'Audit Logs',
                    value=[
                        {
                            'id': '123e4567-e89b-12d3-a456-426614174000',
                            'action': 'login',
                            'resource_type': '',
                            'resource_id': None,
                            'ip_address': '192.168.1.1',
                            'user_agent': 'Mozilla/5.0...',
                            'device_id': 'device_123',
                            'details': {},
                            'timestamp': '2024-01-01T00:00:00Z'
                        }
                    ]
                )
            ]
        )
    }
)

# Password Policy Schema
password_policy_schema = extend_schema(
    tags=['Security & Audit'],
    summary='Get password policy',
    description='Get the user\'s password policy settings.',
    responses={
        200: OpenApiResponse(
            response=PasswordPolicySerializer,
            description='Password policy settings'
        )
    }
)

password_policy_update_schema = extend_schema(
    tags=['Security & Audit'],
    summary='Update password policy',
    description='Update the user\'s password policy settings.',
    request=PasswordPolicySerializer,
    responses={
        200: OpenApiResponse(
            response=PasswordPolicySerializer,
            description='Password policy updated successfully'
        )
    }
)

# Export Data Schema
export_data_schema = extend_schema(
    tags=['Data Export'],
    summary='Export vault data',
    description='''
    Export vault data in JSON or CSV format.
    
    **Security Note**: Documents are not exported by default for security reasons. 
    The export includes encrypted data that can only be decrypted with the user's master key.
    ''',
    request=ExportDataSerializer,
    responses={
        200: OpenApiResponse(
            description='Data exported successfully',
            examples=[
                OpenApiExample(
                    'JSON Export',
                    value='File download with exported data',
                    media_type='application/json'
                ),
                OpenApiExample(
                    'CSV Export',
                    value='File download with exported data',
                    media_type='text/csv'
                )
            ]
        )
    },
    examples=[
        OpenApiExample(
            'Export Request',
            value={
                'format': 'json',
                'include_passwords': True,
                'include_documents': False,
                'include_notes': True,
                'include_cards': True,
                'include_identities': True
            },
            request_only=True
        )
    ]
)

# Toggle Favorite Schema
toggle_favorite_schema = extend_schema(
    tags=['Vault Items'],
    summary='Toggle item favorite status',
    description='Toggle the favorite status of a vault item.',
    responses={
        200: OpenApiResponse(
            description='Favorite status toggled',
            examples=[
                OpenApiExample(
                    'Favorite Toggled',
                    value={
                        'is_favorite': True
                    }
                )
            ]
        ),
        404: OpenApiResponse(
            description='Vault item not found'
        )
    }
)