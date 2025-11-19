import uuid
from django.db import models
from apps.accounts.models import User

class Document(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    file_name = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=100)

    encrypted_file = models.CharField(max_length=500)     # S3 storage path
    encrypted_metadata = models.JSONField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
