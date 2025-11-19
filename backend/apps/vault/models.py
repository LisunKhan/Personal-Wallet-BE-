import uuid
from django.db import models
from apps.accounts.models import User

class VaultItem(models.Model):
    ITEM_TYPES = (
        ("password", "Password"),
        ("note", "Secure Note"),
        ("keyvalue", "Key-Value Secret"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    item_type = models.CharField(max_length=50, choices=ITEM_TYPES)
    encrypted_data = models.JSONField()   # AES encrypted blob
    metadata = models.JSONField(null=True, blank=True)  # title, favicon, etc.

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
