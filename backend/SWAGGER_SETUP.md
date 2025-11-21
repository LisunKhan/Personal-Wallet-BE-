# Swagger API Documentation Setup

## 🚀 Overview

Your Personal Digital Wallet API now has comprehensive Swagger/OpenAPI documentation with organized schemas and detailed examples.

## 📍 Access Points

Once you start the Django server, you can access the API documentation at:

- **Swagger UI**: `http://localhost:8000/api/docs/`
- **ReDoc**: `http://localhost:8000/api/redoc/`
- **OpenAPI Schema**: `http://localhost:8000/api/schema/`

## 🗂️ Documentation Structure

### **Organized by Apps**
- `apps/accounts/schemas.py` - Authentication schemas
- `apps/vault/schemas.py` - Vault management schemas

### **API Tags Organization**
1. **Authentication** - User signup and login
2. **Categories** - Organize vault items
3. **Vault Items** - Core data management
4. **Files** - Secure file operations
5. **Password Tools** - Password generation and security
6. **Statistics** - Analytics and insights
7. **Emergency Access** - Emergency contact management
8. **Security & Audit** - Security settings and logs
9. **Data Export** - Backup and export functionality

## 🔧 Features Implemented

### **Comprehensive Documentation**
- ✅ **Detailed descriptions** for all endpoints
- ✅ **Request/response examples** with realistic data
- ✅ **Error response examples** with common scenarios
- ✅ **Parameter documentation** with types and constraints
- ✅ **Security notes** explaining encryption and privacy
- ✅ **File upload documentation** with supported formats

### **Schema Organization**
- ✅ **Separated by app** for maintainability
- ✅ **Reusable components** for common patterns
- ✅ **Consistent naming** and structure
- ✅ **Detailed examples** for complex operations

### **Security Documentation**
- ✅ **Zero-knowledge architecture** explanations
- ✅ **Client-side encryption** requirements
- ✅ **JWT authentication** flow
- ✅ **File security** and integrity checks
- ✅ **Audit logging** explanations

## 📋 Example Endpoints Documented

### **Authentication**
```
POST /api/accounts/signup/     - Create account
POST /api/accounts/login/      - User login
```

### **Vault Management**
```
GET    /api/vault/categories/           - List categories
POST   /api/vault/categories/           - Create category
GET    /api/vault/items/                - List vault items
POST   /api/vault/items/                - Create vault item
GET    /api/vault/items/{id}/           - Get item details
PUT    /api/vault/items/{id}/           - Update item
DELETE /api/vault/items/{id}/           - Delete item
POST   /api/vault/items/{id}/toggle-favorite/ - Toggle favorite
```

### **File Operations**
```
POST   /api/vault/items/{id}/upload/    - Upload file
GET    /api/vault/files/{id}/download/  - Download file
DELETE /api/vault/files/{id}/delete/    - Delete file
```

### **Tools & Analytics**
```
POST /api/vault/password-generator/     - Generate password
GET  /api/vault/stats/                  - Vault statistics
GET  /api/vault/audit-logs/             - Security logs
POST /api/vault/export/                 - Export data
```

## 🎯 Key Documentation Features

### **Request Examples**
```json
{
  "name": "Gmail Account",
  "item_type": "password",
  "category": "123e4567-e89b-12d3-a456-426614174001",
  "encrypted_data": "encrypted_json_string_here",
  "tags": ["email", "google"]
}
```

### **Response Examples**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Gmail Account",
  "item_type": "password",
  "category_name": "Personal",
  "is_favorite": false,
  "password_strength": 85,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### **Error Examples**
```json
{
  "error": "File type application/exe not allowed"
}
```

## 🔒 Security Documentation

### **Authentication Flow**
1. User creates account with email + master_key_hash
2. Server stores hash, never sees actual password
3. Login returns JWT tokens for API access
4. All subsequent requests require Bearer token

### **Data Encryption**
- All sensitive data encrypted client-side
- Server stores only encrypted data
- Zero-knowledge architecture maintained
- File integrity verified with checksums

### **Audit Trail**
- All actions logged with IP, user agent, timestamp
- Security events tracked for compliance
- Device management and session tracking

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   pip install drf-spectacular
   ```

2. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

3. **Start server:**
   ```bash
   python manage.py runserver
   ```

4. **Access documentation:**
   - Open `http://localhost:8000/api/docs/`
   - Explore the interactive API documentation
   - Test endpoints directly from the browser

## 📝 Customization

### **Adding New Schemas**
1. Create schema in appropriate `schemas.py` file
2. Import and apply to view method
3. Add examples and descriptions
4. Update tags if needed

### **Example Schema Addition**
```python
new_endpoint_schema = extend_schema(
    tags=['Your Tag'],
    summary='Brief description',
    description='Detailed description',
    request=YourSerializer,
    responses={200: YourResponseSerializer},
    examples=[...]
)

@new_endpoint_schema
def your_view_method(self, request):
    # Your implementation
```

## 🎨 UI Features

### **Swagger UI Features**
- Interactive API testing
- Request/response examples
- Authentication testing
- Schema validation
- Export to various formats

### **ReDoc Features**
- Clean, readable documentation
- Code samples in multiple languages
- Nested schema visualization
- Search functionality
- Print-friendly format

Your API documentation is now production-ready with comprehensive coverage of all endpoints, security considerations, and practical examples for developers!