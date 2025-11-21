from django.urls import path
from . import views, file_views

app_name = 'vault'

urlpatterns = [
    # Categories
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<uuid:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    
    # Vault Items
    path('items/', views.VaultItemListCreateView.as_view(), name='vaultitem-list-create'),
    path('items/<uuid:pk>/', views.VaultItemDetailView.as_view(), name='vaultitem-detail'),
    path('items/<uuid:item_id>/toggle-favorite/', views.toggle_favorite, name='toggle-favorite'),
    
    # File Operations
    path('items/<uuid:item_id>/upload/', file_views.upload_file, name='upload-file'),
    path('files/<uuid:file_id>/download/', file_views.download_file, name='download-file'),
    path('files/<uuid:file_id>/delete/', file_views.delete_file, name='delete-file'),
    
    # Password Tools
    path('password-generator/', views.PasswordGeneratorView.as_view(), name='password-generator'),
    
    # Statistics
    path('stats/', views.VaultStatsView.as_view(), name='vault-stats'),
    
    # Emergency Access
    path('emergency-contacts/', views.EmergencyContactListCreateView.as_view(), name='emergency-contact-list-create'),
    path('emergency-contacts/<uuid:pk>/', views.EmergencyContactDetailView.as_view(), name='emergency-contact-detail'),
    
    # Security & Audit
    path('audit-logs/', views.AuditLogListView.as_view(), name='audit-logs'),
    path('password-policy/', views.PasswordPolicyView.as_view(), name='password-policy'),
    
    # Data Export
    path('export/', views.ExportDataView.as_view(), name='export-data'),
]