from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.vault.models import Category, PasswordPolicy

User = get_user_model()


class Command(BaseCommand):
    help = 'Set up initial vault data for users'

    def add_arguments(self, parser):
        parser.add_argument(
            '--user-email',
            type=str,
            help='Email of the user to set up vault for',
        )

    def handle(self, *args, **options):
        user_email = options.get('user_email')
        
        if user_email:
            try:
                user = User.objects.get(email=user_email)
                self.setup_user_vault(user)
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully set up vault for {user_email}')
                )
            except User.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'User with email {user_email} not found')
                )
        else:
            # Set up for all users
            users = User.objects.all()
            for user in users:
                self.setup_user_vault(user)
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully set up vaults for {users.count()} users')
            )

    def setup_user_vault(self, user):
        """Set up initial vault data for a user"""
        
        # Create default categories
        default_categories = [
            {'name': 'Personal', 'category_type': 'password', 'icon': 'user', 'color': '#3B82F6'},
            {'name': 'Work', 'category_type': 'password', 'icon': 'briefcase', 'color': '#10B981'},
            {'name': 'Social Media', 'category_type': 'password', 'icon': 'share', 'color': '#8B5CF6'},
            {'name': 'Banking', 'category_type': 'password', 'icon': 'credit-card', 'color': '#F59E0B'},
            
            {'name': 'Identity Documents', 'category_type': 'document', 'icon': 'identification', 'color': '#EF4444'},
            {'name': 'Certificates', 'category_type': 'document', 'icon': 'academic-cap', 'color': '#06B6D4'},
            {'name': 'Financial', 'category_type': 'document', 'icon': 'chart-bar', 'color': '#84CC16'},
            
            {'name': 'Personal Notes', 'category_type': 'note', 'icon': 'document-text', 'color': '#6366F1'},
            {'name': 'Recovery Codes', 'category_type': 'note', 'icon': 'key', 'color': '#EC4899'},
            
            {'name': 'Credit Cards', 'category_type': 'card', 'icon': 'credit-card', 'color': '#F97316'},
            {'name': 'Bank Cards', 'category_type': 'card', 'icon': 'credit-card', 'color': '#0EA5E9'},
        ]
        
        for category_data in default_categories:
            Category.objects.get_or_create(
                user=user,
                name=category_data['name'],
                category_type=category_data['category_type'],
                defaults={
                    'icon': category_data['icon'],
                    'color': category_data['color']
                }
            )
        
        # Create default password policy
        PasswordPolicy.objects.get_or_create(
            user=user,
            defaults={
                'min_length': 12,
                'require_uppercase': True,
                'require_lowercase': True,
                'require_numbers': True,
                'require_symbols': True,
                'check_compromised_passwords': True,
                'auto_generate_passwords': True,
                'password_history_count': 5,
            }
        )
        
        self.stdout.write(f'Set up vault for {user.email}')