from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()

def hash_password(password):
    """Hashes a password using Argon2."""
    return ph.hash(password)

def verify_password(hashed_password, password):
    """Verifies a password against a hashed version."""
    try:
        ph.verify(hashed_password, password)
        return True
    except VerifyMismatchError:
        return False
