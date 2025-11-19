import base64
import json
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

# Argon2 password hashing
ph = PasswordHasher()

def hash_password(password):
    """Hashes a password using Argon2."""
    return ph.hash(password)

def verify_password(hashed_password, password):
    """Verifies a password against a hashed password."""
    try:
        ph.verify(hashed_password, password)
        return True
    except VerifyMismatchError:
        return False

# AES-256-GCM encryption
def encrypt_data(data, key):
    """Encrypts data using AES-256-GCM."""
    if isinstance(data, dict) or isinstance(data, list):
        data = json.dumps(data).encode('utf-8')
    elif isinstance(data, str):
        data = data.encode('utf-8')

    header = b"header"
    cipher = AES.new(key, AES.MODE_GCM)
    cipher.update(header)
    ciphertext, tag = cipher.encrypt_and_digest(data)

    encrypted_blob = {
        'cipher': 'AES-256-GCM',
        'nonce': base64.b64encode(cipher.nonce).decode('utf-8'),
        'header': base64.b64encode(header).decode('utf-8'),
        'ciphertext': base64.b64encode(ciphertext).decode('utf-8'),
        'tag': base64.b64encode(tag).decode('utf-8'),
    }
    return encrypted_blob

def decrypt_data(encrypted_blob, key):
    """Decrypts data using AES-256-GCM."""
    try:
        nonce = base64.b64decode(encrypted_blob['nonce'])
        header = base64.b64decode(encrypted_blob['header'])
        ciphertext = base64.b64decode(encrypted_blob['ciphertext'])
        tag = base64.b64decode(encrypted_blob['tag'])

        cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
        cipher.update(header)
        decrypted_data = cipher.decrypt_and_verify(ciphertext, tag)

        try:
            return json.loads(decrypted_data.decode('utf-8'))
        except json.JSONDecodeError:
            return decrypted_data.decode('utf-8')
    except (ValueError, KeyError, TypeError):
        return None

def generate_random_key(length=32):
    """Generates a random key for encryption."""
    return get_random_bytes(length)
