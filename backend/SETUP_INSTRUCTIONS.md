# Personal Digital Wallet - Backend Setup Instructions

## 🚀 Quick Setup (Recommended)

### Option 1: Automated Setup
```bash
cd backend
python setup.py
```

This will automatically:
- Install all dependencies
- Create secure .env file
- Run database migrations
- Set up initial vault data
- Optionally create superuser

### Option 2: Manual Setup

#### 1. Install Dependencies
```bash
# Try the development requirements first (more compatible)
pip install -r requirements-dev.txt

# Or use the main requirements file
pip install -r requirements.txt
```

#### 2. Create Environment File
Create a `.env` file in the backend directory:
```env
DEBUG=True
DJANGO_SECRET_KEY=your-secret-key-here
VAULT_ENCRYPTION_KEY=your-32-byte-base64-key-here
CORS_ALLOW_ALL_ORIGINS=True
```

#### 3. Database Setup
```bash
python manage.py makemigrations
python manage.py migrate
```

#### 4. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

#### 5. Setup Initial Data
```bash
python manage.py setup_vault
```

#### 6. Start Development Server
```bash
python manage.py runserver
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Cryptography Installation Error
If you get cryptography installation errors:

**For Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install build-essential libssl-dev libffi-dev python3-dev
pip install --upgrade pip
pip install cryptography
```

**For macOS:**
```bash
brew install openssl libffi
export LDFLAGS="-L$(brew --prefix openssl)/lib"
export CPPFLAGS="-I$(brew --prefix openssl)/include"
pip install cryptography
```

**For Windows:**
```bash
# Use pre-compiled wheels
pip install --only-binary=cryptography cryptography
```

#### 2. PostgreSQL Setup (Production)
```bash
# Install PostgreSQL adapter
pip install psycopg2-binary

# Update .env file
DATABASE_URL=postgresql://username:password@localhost:5432/digital_wallet
```

#### 3. Python Version Compatibility
This project requires Python 3.8+. Check your version:
```bash
python --version
```

If you have an older version, consider using pyenv or conda to manage Python versions.

## 📁 Project Structure

```
backend/
├── apps/
│   ├── accounts/          # User authentication
│   │   ├── models.py      # User model
│   │   ├── views.py       # Auth endpoints
│   │   ├── serializers.py # API serializers
│   │   ├── schemas.py     # Swagger schemas
│   │   └── urls.py        # URL routing
│   └── vault/             # Vault management
│       ├── models.py      # Vault data models
│       ├── views.py       # Vault endpoints
│       ├── file_views.py  # File operations
│       ├── serializers.py # API serializers
│       ├── schemas.py     # Swagger schemas
│       ├── utils.py       # Utility functions
│       ├── admin.py       # Django admin
│       └── urls.py        # URL routing
├── config/
│   ├── settings.py        # Django settings
│   ├── urls.py           # Main URL config
│   └── wsgi.py           # WSGI config
├── utils/
│   └── hashers.py        # Password hashing
├── media/                # File storage (created automatically)
├── requirements.txt      # Python dependencies
├── requirements-dev.txt  # Development dependencies
├── setup.py             # Automated setup script
└── manage.py            # Django management
```

## 🔐 Security Configuration

### Environment Variables
Create a `.env` file with these variables:

```env
# Required
DEBUG=True
DJANGO_SECRET_KEY=your-very-long-secret-key-here
VAULT_ENCRYPTION_KEY=your-32-byte-base64-encoded-key

# Database (optional for development)
DATABASE_URL=sqlite:///db.sqlite3

# CORS (development only)
CORS_ALLOW_ALL_ORIGINS=True

# Email (production)
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@domain.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Generating Secure Keys
```python
# Generate Django secret key
import secrets
print(secrets.token_urlsafe(50))

# Generate vault encryption key
import base64
print(base64.urlsafe_b64encode(secrets.token_bytes(32)).decode())
```

## 🌐 API Access Points

Once running, access these URLs:

- **API Documentation (Swagger)**: http://localhost:8000/api/docs/
- **API Documentation (ReDoc)**: http://localhost:8000/api/redoc/
- **Admin Panel**: http://localhost:8000/admin/
- **API Schema**: http://localhost:8000/api/schema/

## 🧪 Testing the API

### 1. Create Account
```bash
curl -X POST http://localhost:8000/api/accounts/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "master_key_hash": "hashed_password_here"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "master_key_hash": "hashed_password_here"
  }'
```

### 3. Access Protected Endpoints
```bash
curl -X GET http://localhost:8000/api/vault/stats/ \
  -H "Authorization: Bearer your_access_token_here"
```

## 🚀 Production Deployment

### Environment Setup
```env
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Security Checklist
- [ ] Set DEBUG=False
- [ ] Use PostgreSQL database
- [ ] Configure proper CORS settings
- [ ] Set up SSL/HTTPS
- [ ] Use environment variables for secrets
- [ ] Set up proper logging
- [ ] Configure email backend
- [ ] Set up monitoring and backups

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Ensure all dependencies are installed correctly
3. Verify your Python version (3.8+ required)
4. Check that all environment variables are set
5. Review the Django logs for specific error messages

## 🎯 Next Steps

After setup:
1. Explore the API documentation at `/api/docs/`
2. Test endpoints using the interactive Swagger UI
3. Set up your frontend to connect to these APIs
4. Configure production settings when ready to deploy