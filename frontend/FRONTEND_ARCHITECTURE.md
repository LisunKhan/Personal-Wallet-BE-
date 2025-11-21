# Personal Digital Wallet - Frontend Architecture

## 🏗️ Complete Frontend Structure

### **API Integration Mapping**
Each backend API endpoint has corresponding frontend components and services:

#### **Authentication APIs**
- `POST /api/accounts/signup/` → SignupPage, useAuth hook
- `POST /api/accounts/login/` → LoginPage, useAuth hook

#### **Category Management APIs**
- `GET /api/vault/categories/` → CategoryList, CategorySelector
- `POST /api/vault/categories/` → CreateCategoryModal
- `PUT /api/vault/categories/{id}/` → EditCategoryModal
- `DELETE /api/vault/categories/{id}/` → DeleteCategoryModal

#### **Vault Item APIs**
- `GET /api/vault/items/` → VaultItemList, Dashboard
- `POST /api/vault/items/` → CreateItemModal, AddItemForm
- `GET /api/vault/items/{id}/` → ItemDetailView, ItemEditForm
- `PUT /api/vault/items/{id}/` → ItemEditForm
- `DELETE /api/vault/items/{id}/` → DeleteItemModal
- `POST /api/vault/items/{id}/toggle-favorite/` → FavoriteButton

#### **File Management APIs**
- `POST /api/vault/items/{id}/upload/` → FileUploadComponent
- `GET /api/vault/files/{id}/download/` → FileDownloadButton
- `DELETE /api/vault/files/{id}/delete/` → FileDeleteButton

#### **Password Tools APIs**
- `POST /api/vault/password-generator/` → PasswordGenerator

#### **Statistics APIs**
- `GET /api/vault/stats/` → Dashboard, SecurityDashboard

#### **Emergency Access APIs**
- `GET /api/vault/emergency-contacts/` → EmergencyContactsList
- `POST /api/vault/emergency-contacts/` → AddEmergencyContactModal

#### **Security & Audit APIs**
- `GET /api/vault/audit-logs/` → AuditLogsList, SecurityDashboard
- `GET /api/vault/password-policy/` → PasswordPolicySettings
- `PUT /api/vault/password-policy/` → PasswordPolicySettings

#### **Data Export APIs**
- `POST /api/vault/export/` → ExportDataModal

## 📁 Frontend Directory Structure

```
frontend/src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── vault/           # Vault management components
│   ├── categories/      # Category management
│   ├── files/           # File operations
│   ├── security/        # Security features
│   ├── common/          # Shared components
│   └── layout/          # Layout components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── services/            # API service layer
├── utils/               # Utility functions
├── contexts/            # React contexts
├── types/               # TypeScript types
└── styles/              # CSS/styling files
```

## 🔧 Technology Stack

- **React 18** with hooks and functional components
- **TypeScript** for type safety
- **React Router** for navigation
- **React Query/TanStack Query** for API state management
- **Zustand** for global state management
- **React Hook Form** for form handling
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hot Toast** for notifications

## 🎨 UI/UX Design Principles

- **Clean, modern interface** with intuitive navigation
- **Responsive design** for all screen sizes
- **Dark/light mode** support
- **Accessibility** compliant (WCAG 2.1)
- **Progressive Web App** capabilities
- **Offline support** for cached data