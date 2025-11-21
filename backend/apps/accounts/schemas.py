from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse
from drf_spectacular.openapi import AutoSchema
from rest_framework import status
from .serializers import UserSerializer, LoginSerializer


# Authentication Schemas
signup_schema = extend_schema(
    tags=['Authentication'],
    summary='Create new user account',
    description='''
    Create a new user account with email and master key hash.
    
    **Security Note**: The master_key_hash should be generated client-side using 
    a secure hashing algorithm (like Argon2) with the user's email as salt. 
    The server never receives the actual master password.
    ''',
    request=UserSerializer,
    responses={
        201: OpenApiResponse(
            response=UserSerializer,
            description='Account created successfully',
            examples=[
                OpenApiExample(
                    'Success Response',
                    value={
                        'email': 'user@example.com'
                    }
                )
            ]
        ),
        400: OpenApiResponse(
            description='Bad Request - Invalid data',
            examples=[
                OpenApiExample(
                    'Validation Error',
                    value={
                        'email': ['This field is required.'],
                        'master_key_hash': ['This field is required.']
                    }
                ),
                OpenApiExample(
                    'Email Already Exists',
                    value={
                        'email': ['User with this email already exists.']
                    }
                )
            ]
        )
    },
    examples=[
        OpenApiExample(
            'Signup Request',
            value={
                'email': 'user@example.com',
                'master_key_hash': '$argon2id$v=19$m=65536,t=3,p=4$...'
            },
            request_only=True
        )
    ]
)

login_schema = extend_schema(
    tags=['Authentication'],
    summary='User login',
    description='''
    Authenticate user with email and master key hash.
    
    Returns JWT tokens for accessing protected endpoints.
    
    **Security Note**: The master_key_hash should be the same hash generated 
    during signup. The server compares hashes directly.
    ''',
    request=LoginSerializer,
    responses={
        200: OpenApiResponse(
            description='Login successful',
            examples=[
                OpenApiExample(
                    'Success Response',
                    value={
                        'refresh': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...',
                        'access': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
                    }
                )
            ]
        ),
        400: OpenApiResponse(
            description='Bad Request - Invalid credentials',
            examples=[
                OpenApiExample(
                    'Invalid Credentials',
                    value={
                        'non_field_errors': ['Invalid credentials']
                    }
                ),
                OpenApiExample(
                    'Missing Fields',
                    value={
                        'email': ['This field is required.'],
                        'master_key_hash': ['This field is required.']
                    }
                )
            ]
        )
    },
    examples=[
        OpenApiExample(
            'Login Request',
            value={
                'email': 'user@example.com',
                'master_key_hash': '$argon2id$v=19$m=65536,t=3,p=4$...'
            },
            request_only=True
        )
    ]
)