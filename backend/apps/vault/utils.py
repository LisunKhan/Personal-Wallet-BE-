from cryptography.fernet import Fernet
from django.conf import settings
import json
import base64
from .models import AuditLog
from django.utils import timezone


def get_client_ip(request):
    """Get client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def log_user_action(user, action, request, resource_type=None, resource_id=None, details=None):
    """Log user actions for security audit"""
    AuditLog.objects.create(
        user=user,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        ip_address=get_client_ip(request),
        user_agent=request.META.get('HTTP_USER_AGENT', ''),
        device_id=request.META.get('HTTP_X_DEVICE_ID', ''),
        details=details or {}
    )


def encrypt_data(data, key=None):
    """
    Encrypt sensitive data before storing in database
    Note: In production, you should use user-specific encryption keys
    """
    if key is None:
        # Use a default key from settings (not recommended for production)
        key = getattr(settings, 'VAULT_ENCRYPTION_KEY', Fernet.generate_key())
    
    if isinstance(key, str):
        key = key.encode()
    
    fernet = Fernet(key)
    
    if isinstance(data, dict):
        data = json.dumps(data)
    
    encrypted_data = fernet.encrypt(data.encode())
    return base64.b64encode(encrypted_data).decode()


def decrypt_data(encrypted_data, key=None):
    """
    Decrypt sensitive data when retrieving from database
    """
    if key is None:
        # Use a default key from settings (not recommended for production)
        key = getattr(settings, 'VAULT_ENCRYPTION_KEY', Fernet.generate_key())
    
    if isinstance(key, str):
        key = key.encode()
    
    fernet = Fernet(key)
    
    try:
        encrypted_bytes = base64.b64decode(encrypted_data.encode())
        decrypted_data = fernet.decrypt(encrypted_bytes)
        return decrypted_data.decode()
    except Exception as e:
        raise ValueError(f"Failed to decrypt data: {str(e)}")


def calculate_password_strength(password):
    """
    Calculate password strength score (0-100)
    """
    if not password:
        return 0
    
    score = 0
    length = len(password)
    
    # Length scoring
    if length >= 8:
        score += 25
    if length >= 12:
        score += 15
    if length >= 16:
        score += 10
    
    # Character variety
    has_lower = any(c.islower() for c in password)
    has_upper = any(c.isupper() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_symbol = any(not c.isalnum() for c in password)
    
    variety_score = sum([has_lower, has_upper, has_digit, has_symbol]) * 12.5
    score += variety_score
    
    # Penalty for common patterns
    if password.lower() in ['password', '123456', 'qwerty', 'admin']:
        score = 0
    
    # Penalty for repeated characters
    if len(set(password)) < len(password) * 0.5:
        score *= 0.7
    
    return min(100, int(score))


def check_password_compromised(password):
    """
    Check if password appears in known breach databases
    This is a placeholder - in production, you'd integrate with HaveIBeenPwned API
    """
    # Common compromised passwords
    common_passwords = [
        'password', '123456', 'password123', 'admin', 'qwerty',
        'letmein', 'welcome', 'monkey', '1234567890', 'abc123'
    ]
    
    return password.lower() in common_passwords


def generate_recovery_codes(count=10):
    """
    Generate backup recovery codes for emergency access
    """
    import secrets
    import string
    
    codes = []
    for _ in range(count):
        code = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))
        # Format as XXXX-XXXX
        formatted_code = f"{code[:4]}-{code[4:]}"
        codes.append(formatted_code)
    
    return codes


def validate_file_type(file):
    """
    Validate uploaded file types for security
    """
    allowed_types = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]
    
    max_size = 10 * 1024 * 1024  # 10MB
    
    if file.content_type not in allowed_types:
        raise ValueError(f"File type {file.content_type} not allowed")
    
    if file.size > max_size:
        raise ValueError(f"File size {file.size} exceeds maximum allowed size")
    
    return True


def sanitize_filename(filename):
    """
    Sanitize filename for secure storage
    """
    import re
    import os
    
    # Remove path components
    filename = os.path.basename(filename)
    
    # Remove or replace dangerous characters
    filename = re.sub(r'[^\w\s.-]', '', filename)
    filename = re.sub(r'[-\s]+', '-', filename)
    
    # Limit length
    if len(filename) > 255:
        name, ext = os.path.splitext(filename)
        filename = name[:255-len(ext)] + ext
    
    return filename