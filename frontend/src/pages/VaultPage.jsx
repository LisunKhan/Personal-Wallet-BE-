import React, { useState } from 'react';
import { useVaultItems, useCategories, useCreateVaultItem, useDeleteVaultItem } from '../hooks/useVault';
import SearchBar from '../components/common/SearchBar';
import CategoryFilter from '../components/categories/CategoryFilter';
import CategoryManager from '../components/categories/CategoryManager';
import VaultItemCard from '../components/vault/VaultItemCard';
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Vault</h1>
            <p className="text-gray-600 mt-2">
              Securely store and manage your passwords, documents, and sensitive information
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCategoryManager(true)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Categories
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Item
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <SearchBar
              placeholder="Search your vault..."
              onSearch={handleSearch}
              className="flex-1"
            />

            <div className="flex gap-4">
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange({ type: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="password">Passwords</option>
                <option value="document">Documents</option>
                <option value="note">Notes</option>
                <option value="card">Cards</option>
                <option value="identity">Identities</option>
              </select>

              <CategoryFilter
                categories={categories || []}
                selectedCategory={filters.category}
                onCategoryChange={(category) => handleFilterChange({ category })}
              />

              <button
                onClick={() => handleFilterChange({
                  favorite: filters.favorite === true ? undefined : true
                })}
                className={`px-4 py-2 rounded-lg border transition-colors ${filters.favorite === true
                  ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                ⭐ Favorites
              </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaultItems && vaultItems.length > 0 ? (
            vaultItems.map((item) => (
              <VaultItemCard
                key={item.id}
                item={item}
                categories={categories || []}
                onDelete={() => handleDeleteItem(item.id)}
              />
            ))
          ) : (
            <EmptyVaultState onCreateItem={() => setShowCreateForm(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyVaultState = ({ onCreateItem }) => (
  <div className="col-span-full text-center py-16">
    <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
      <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Your vault is empty</h3>
    <p className="text-gray-500 mb-8 max-w-md mx-auto">
      Start securing your digital life by adding your first password, document, or secure note.
    </p>
    <button
      onClick={onCreateItem}
      className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Add Your First Item
    </button>
  </div>
);

// Create Item Modal Component
const CreateItemModal = ({ onClose, onCreate, categories, isLoading }) => {
  const [selectedType, setSelectedType] = useState('password');
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Item</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Type</label>
            <div className="grid grid-cols-2 gap-2">
              {itemTypes.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setSelectedType(item.type)}
                  className={`p-3 rounded-lg border text-left flex items-center ${selectedType === item.type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Gmail Account"
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username/Email</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VaultPage;