# Personal Digital Wallet - API Documentation

## Authentication

All API endpoints require JWT authentication except for signup and login.

### Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Endpoints

### Authentication

#### POST /api/accounts/signup/
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "master_key_hash": "hashed_password_from_frontend"
}
```

**Response:**
```json
{
  "email": "user@example.com"
}
```

#### POST /api/accounts/login/
Login with email and master key hash.

**Request:**
```json
{
  "email": "user@example.com",
  "master_key_hash": "hashed_password_from_frontend"
}
```

**Response:**
```json
{
  "refresh": "refresh_token",
  "access": "access_token"
}
```

### Categories

#### GET /api/vault/categories/
List all categories for the authenticated user.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Personal",
    "category_type": "password",
    "icon": "user",
    "color": "#3B82F6",
    "items_count": 5,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /api/vault/categories/
Create a new category.

**Request:**
```json
{
  "name": "Work Accounts",
  "category_type": "password",
  "icon": "briefcase",
  "color": "#10B981"
}
```

### Vault Items

#### GET /api/vault/items/
List all vault items for the authenticated user.

**Query Parameters:**
- `type`: Filter by item type (password, document, note, card, identity)
- `category`: Filter by category ID
- `favorite`: Filter favorites (true/false)
- `search`: Search by name

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Gmail Account",
    "item_type": "password",
    "category": "category_uuid",
    "category_name": "Personal",
    "is_favorite": false,
    "tags": ["email", "google"],
    "password_strength": 85,
    "is_compromised": false,
    "last_used": "2024-01-01T00:00:00Z",
    "files_count": 0,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /api/vault/items/
Create a new vault item.

**Request:**
```json
{
  "name": "Gmail Account",
  "item_type": "password",
  "category": "category_uuid",
  "encrypted_data": "encrypted_json_string",
  "tags": ["email", "google"]
}
```

#### GET /api/vault/items/{id}/
Get a specific vault item (includes encrypted_data).

#### PUT /api/vault/items/{id}/
Update a vault item.

#### DELETE /api/vault/items/{id}/
Delete a vault item.

#### POST /api/vault/items/{id}/toggle-favorite/
Toggle favorite status of an item.

### File Operations

#### POST /api/vault/items/{item_id}/upload/
Upload a file for a vault item.

**Request:** Multipart form data with 'file' field

**Response:**
```json
{
  "id": "file_uuid",
  "filename": "document.pdf",
  "size": 1024000,
  "mime_type": "application/pdf",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### GET /api/vault/files/{file_id}/download/
Download a secure file.

#### DELETE /api/vault/files/{file_id}/delete/
Delete a secure file.

### Password Tools

#### POST /api/vault/password-generator/
Generate a secure password.

**Request:**
```json
{
  "length": 16,
  "include_uppercase": true,
  "include_lowercase": true,
  "include_numbers": true,
  "include_symbols": true,
  "exclude_ambiguous": true
}
```

**Response:**
```json
{
  "password": "Kx9#mP2$vL8@nQ5!"
}
```

### Statistics

#### GET /api/vault/stats/
Get vault statistics.

**Response:**
```json
{
  "total_items": 25,
  "passwords_count": 15,
  "documents_count": 5,
  "notes_count": 3,
  "cards_count": 2,
  "identities_count": 0,
  "weak_passwords": 2,
  "compromised_passwords": 0,
  "duplicate_passwords": 1,
  "categories_count": 8,
  "storage_used": 5242880
}
```

### Emergency Access

#### GET /api/vault/emergency-contacts/
List emergency contacts.

#### POST /api/vault/emergency-contacts/
Create an emergency contact.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "access_delay_days": 7,
  "can_access_passwords": true,
  "can_access_documents": false,
  "can_access_notes": true
}
```

### Security & Audit

#### GET /api/vault/audit-logs/
Get recent audit logs.

#### GET /api/vault/password-policy/
Get user's password policy.

#### PUT /api/vault/password-policy/
Update password policy.

### Data Export

#### POST /api/vault/export/
Export vault data.

**Request:**
```json
{
  "format": "json",
  "include_passwords": true,
  "include_documents": false,
  "include_notes": true,
  "include_cards": true,
  "include_identities": true
}
```

## Data Structures

### Encrypted Data Format

The `encrypted_data` field contains encrypted JSON with the following structure based on item type:

#### Password Item
```json
{
  "username": "user@example.com",
  "password": "secret_password",
  "url": "https://example.com",
  "notes": "Additional notes",
  "totp_secret": "optional_2fa_secret"
}
```

#### Document Item
```json
{
  "description": "Passport document",
  "document_number": "A1234567",
  "issue_date": "2020-01-01",
  "expiry_date": "2030-01-01",
  "issuing_authority": "Government",
  "notes": "Additional notes"
}
```

#### Note Item
```json
{
  "content": "Secret note content",
  "is_markdown": false
}
```

#### Card Item
```json
{
  "card_number": "1234567890123456",
  "cardholder_name": "John Doe",
  "expiry_month": "12",
  "expiry_year": "2025",
  "cvv": "123",
  "pin": "1234",
  "notes": "Additional notes"
}
```

#### Identity Item
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "country": "USA",
  "ssn": "123-45-6789",
  "notes": "Additional notes"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional details if available"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 204: No Content (for deletions)
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error