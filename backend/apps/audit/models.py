from django.db import models
from apps.accounts.models import User

class AuditLog(models.Model):
    ACTIONS = (
        ("login", "Login"),
        ("logout", "Logout"),
        ("create_item", "Create Vault Item"),
        ("update_item", "Update Vault Item"),
        ("delete_item", "Delete Vault Item"),
        ("upload_document", "Upload Document"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=50, choices=ACTIONS)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True)
    device_name = models.CharField(max_length=255, null=True)
