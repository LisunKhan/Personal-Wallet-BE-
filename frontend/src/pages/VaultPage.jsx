import React, { useState } from 'react';
import { useVaultItems, useCategories, useCreateVaultItem, useDeleteVaultItem } from '../hooks/useVault';
import SearchBar from '../components/common/SearchBar';
import CategoryFilter from '../components/categories/CategoryFilter';
import CategoryManager from '../components/categories/CategoryManager';
import VaultItemCard from '../components/vault/VaultItemCard';
import PasswordStrengthIndicator from '../components/vault/PasswordStrengthIndicator';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const VaultPage = () => {
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: '',
    favorite: undefined,
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // API hooks
  const { data: vaultItems, isLoading: itemsLoading, error: itemsError } = useVaultItems(filters);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createVaultItemMutation = useCreateVaultItem();
  const deleteVaultItemMutation = useDeleteVaultItem();

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleCreateItem = async (type, formData) => {
    try {
      const itemData = {
        name: formData.name,
        type: type,
        category: formData.category || null,
        notes: formData.notes || '',
        data: {}, // Will be populated based on type
      };

      // Add type-specific data
      if (type === 'password') {
        itemData.data = {
          username: formData.username || '',
          password: formData.password || '',
          url: formData.url || '',
        };
      }

      await createVaultItemMutation.mutateAsync(itemData);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteVaultItemMutation.mutateAsync(itemId);
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  if (itemsLoading || categoriesLoading) {
    return <LoadingSpinner />;
  }

  if (itemsError) {
    return <ErrorMessage message={itemsError.message} />;
  }

  return (
    <div className="min-vh-100 bg-light-override">
      <div className="gradient-bg-light min-vh-100 py-4">
        <div className="container-fluid">
          {/* Header */}
          <div className="row align-items-center mb-4 fade-in">
            <div className="col-md-8">
              <h1 className="display-4 fw-bold text-dark-override mb-2">🔐 Your Vault</h1>
              <p className="lead text-muted">
                Securely store and manage your passwords, documents, and sensitive information
              </p>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="btn-group" role="group">
                <button
                  onClick={() => setShowCategoryManager(true)}
                  className="btn btn-outline-secondary btn-custom me-2"
                >
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Categories
                </button>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn btn-primary-custom btn-custom"
                >
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Item
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card card-custom mb-4 slide-up">
            <div className="card-body">
              <div className="row g-3 align-items-center">
                <div className="col-lg-6">
                  <SearchBar
                    placeholder="🔍 Search your vault..."
                    onSearch={handleSearch}
                    className="form-control-custom"
                  />
                </div>
                <div className="col-lg-6">
                  <div className="row g-2">
                    <div className="col-md-4">
                      <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange({ type: e.target.value })}
                        className="form-select form-control-custom"
                      >
                        <option value="">All Types</option>
                        <option value="password">🔑 Passwords</option>
                        <option value="document">📄 Documents</option>
                        <option value="note">📝 Notes</option>
                        <option value="card">💳 Cards</option>
                        <option value="identity">👤 Identities</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <CategoryFilter
                        categories={categories || []}
                        selectedCategory={filters.category}
                        onCategoryChange={(category) => handleFilterChange({ category })}
                      />
                    </div>
                    <div className="col-md-4">
                      <button
                        onClick={() => handleFilterChange({
                          favorite: filters.favorite === true ? undefined : true
                        })}
                        className={`btn w-100 ${filters.favorite === true
                          ? 'btn-warning'
                          : 'btn-outline-warning'
                          }`}
                      >
                        ⭐ Favorites
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modals */}
          {showCreateForm && (
            <CreateItemModal
              onClose={() => setShowCreateForm(false)}
              onCreate={handleCreateItem}
              categories={categories || []}
              isLoading={createVaultItemMutation.isPending}
            />
          )}

          {showCategoryManager && (
            <CategoryManager onClose={() => setShowCategoryManager(false)} />
          )}

          {/* Vault Items */}
          <div className="row g-4">
            {vaultItems && vaultItems.length > 0 ? (
              vaultItems.map((item) => (
                <div key={item.id} className="col-lg-4 col-md-6 col-sm-12">
                  <VaultItemCard
                    item={item}
                    categories={categories || []}
                    onDelete={() => handleDeleteItem(item.id)}
                  />
                </div>
              ))
            ) : (
              <div className="col-12">
                <EmptyVaultState onCreateItem={() => setShowCreateForm(true)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyVaultState = ({ onCreateItem }) => (
  <div className="text-center py-5 fade-in">
    <div className="card card-custom border-0 shadow-lg">
      <div className="card-body p-5">
        <div className="mb-4">
          <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '100px', height: '100px'}}>
            <svg width="50" height="50" className="text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h3 className="h2 fw-bold text-dark-override mb-3">Your vault is empty</h3>
        <p className="text-muted mb-4 lead">
          Start securing your digital life by adding your first password, document, or secure note.
        </p>
        <button
          onClick={onCreateItem}
          className="btn btn-primary-custom btn-lg btn-custom"
        >
          <svg className="me-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Your First Item
        </button>
      </div>
    </div>
  </div>
);

// Create Item Modal Component
const CreateItemModal = ({ onClose, onCreate, categories, isLoading }) => {
  const [selectedType, setSelectedType] = useState('password');
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    url: '',
    notes: '',
    category: '',
  });

  const itemTypes = [
    { type: 'password', label: 'Password', icon: '🔑' },
    { type: 'note', label: 'Secure Note', icon: '📝' },
    { type: 'card', label: 'Credit Card', icon: '💳' },
    { type: 'identity', label: 'Identity', icon: '👤' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(selectedType, formData);
  };

  const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData(prev => ({ ...prev, password }));
  };

  return (
    <div className="modal modal-custom d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content modal-content-custom">
          <div className="modal-header border-0 pb-0">
            <h2 className="modal-title h4 fw-bold text-dark-override">✨ Add New Item</h2>
            <button onClick={onClose} className="btn-close" aria-label="Close"></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Item Type Selection */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-dark-override">Item Type</label>
                <div className="row g-2">
                  {itemTypes.map((item) => (
                    <div key={item.type} className="col-6">
                      <button
                        type="button"
                        onClick={() => setSelectedType(item.type)}
                        className={`btn w-100 p-3 text-start ${selectedType === item.type
                          ? 'btn-primary'
                          : 'btn-outline-secondary'
                          }`}
                      >
                        <span className="me-2 fs-5">{item.icon}</span>
                        <span className="fw-medium">{item.label}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark-override">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="form-control form-control-custom"
                  placeholder="e.g., Gmail Account"
                  required
                />
              </div>

              {/* Category Selection */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark-override">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="form-select form-control-custom"
                >
                  <option value="">No Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedType === 'password' && (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark-override">Username/Email</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      className="form-control form-control-custom"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark-override">Password</label>
                    <div className="mb-3">
                      <div className="input-group">
                        <input
                          type={showPasswordGenerator ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="form-control form-control-custom"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={generatePassword}
                          className="btn btn-success-custom"
                          title="Generate Password"
                        >
                          <svg width="16" height="16" className="me-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Generate
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPasswordGenerator(!showPasswordGenerator)}
                          className="btn btn-outline-secondary"
                          title={showPasswordGenerator ? "Hide Password" : "Show Password"}
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {showPasswordGenerator ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            )}
                          </svg>
                        </button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-2">
                          <PasswordStrengthIndicator password={formData.password} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark-override">Website URL</label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                      className="form-control form-control-custom"
                      placeholder="https://example.com"
                    />
                  </div>
                </>
              )}

              <div className="mb-4">
                <label className="form-label fw-semibold text-dark-override">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="form-control form-control-custom"
                  rows="3"
                  placeholder="Additional notes..."
                />
              </div>
            </form>
          </div>

          <div className="modal-footer border-0 pt-0">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline-secondary btn-custom me-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary-custom btn-custom"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Item
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultPage;