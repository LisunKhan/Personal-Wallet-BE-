#!/usr/bin/env python3
"""
Setup script for Personal Digital Wallet Backend
"""
import os
import sys
import subprocess
import secrets
import base64

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"Error: {e.stderr}")
        return False

def generate_encryption_key():
    """Generate a secure encryption key"""
    key = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode()
    return key

def create_env_file():
    """Create .env file with secure defaults"""
    env_content = f"""# Django Settings
DEBUG=True
DJANGO_SECRET_KEY={secrets.token_urlsafe(50)}

# Database (uncomment for PostgreSQL)
# DATABASE_URL=postgresql://user:password@localhost:5432/digital_wallet

# Vault Encryption (IMPORTANT: Keep this secure!)
VAULT_ENCRYPTION_KEY={generate_encryption_key()}

# CORS Settings (for development)
CORS_ALLOW_ALL_ORIGINS=True

# Email Settings (for production)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USE_TLS=True
# EMAIL_HOST_USER=your-email@gmail.com
# EMAIL_HOST_PASSWORD=your-app-password
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print("✅ Created .env file with secure defaults")
    print("⚠️  IMPORTANT: Keep your VAULT_ENCRYPTION_KEY secure!")

def main():
    """Main setup function"""
    print("🚀 Setting up Personal Digital Wallet Backend...")
    
    # Check if we're in the right directory
    if not os.path.exists('manage.py'):
        print("❌ Error: Please run this script from the backend directory")
        sys.exit(1)
    
    # Create .env file
    if not os.path.exists('.env'):
        create_env_file()
    else:
        print("ℹ️  .env file already exists, skipping creation")
    
    # Install dependencies
    print("\n📦 Installing dependencies...")
    if os.path.exists('requirements-dev.txt'):
        success = run_command('pip install -r requirements-dev.txt', 'Installing development dependencies')
    else:
        success = run_command('pip install -r requirements.txt', 'Installing dependencies')
    
    if not success:
        print("❌ Failed to install dependencies. Please install manually:")
        print("   pip install -r requirements-dev.txt")
        return
    
    # Run migrations
    if not run_command('python manage.py makemigrations', 'Creating migrations'):
        return
    
    if not run_command('python manage.py migrate', 'Running migrations'):
        return
    
    # Create superuser (optional)
    print("\n👤 Would you like to create a superuser account? (y/n): ", end="")
    if input().lower().startswith('y'):
        run_command('python manage.py createsuperuser', 'Creating superuser')
    
    # Setup initial vault data
    run_command('python manage.py setup_vault', 'Setting up initial vault data')
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("   1. Start the development server:")
    print("      python manage.py runserver")
    print("\n   2. Access the API documentation:")
    print("      http://localhost:8000/api/docs/")
    print("\n   3. Access the admin panel:")
    print("      http://localhost:8000/admin/")
    print("\n⚠️  Security Notes:")
    print("   - Keep your .env file secure and never commit it to version control")
    print("   - Change DEBUG=False in production")
    print("   - Use a proper database (PostgreSQL) in production")
    print("   - Set up proper CORS settings in production")

if __name__ == '__main__':
    main()