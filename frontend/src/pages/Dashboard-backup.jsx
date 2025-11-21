// Backup of original Dashboard
import React, { useState } from 'react';
import { useVaultItems, useVaultStats, useCategories } from '../hooks/useVault';
import VaultItemCard from '../components/vault/VaultItemCard';
import StatsCard from '../components/dashboard/StatsCard';
import CategoryFilter from '../components/categories/CategoryFilter';
import SearchBar from '../components/common/SearchBar';
import CreateItemButton from '../components/vault/CreateItemButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const Dashboard = () => {
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    favorite: undefined,
    search: '',
  });

  // Fetch data using custom hooks
  const { data: vaultItems, isLoading: itemsLoading, error: itemsError } = useVaultItems(filters);
  const { data: stats, isLoading: statsLoading } = useVaultStats();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  if (itemsLoading || statsLoading || categoriesLoading) {
    return <LoadingSpinner />;
  }

  if (itemsError) {
    return <ErrorMessage message={itemsError.message} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Digital Vault
          </h1>
          <p className="text-gray-600">
            Securely manage your passwords, documents, and sensitive information
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Items"
              value={stats.total_items}
              icon="collection"
              color="blue"
            />
            <StatsCard
              title="Passwords"
              value={stats.passwords_count}
              icon="key"
              color="green"
            />
            <StatsCard
              title="Documents"
              value={stats.documents_count}
              icon="document"
              color="purple"
            />
            <StatsCard
              title="Weak Passwords"
              value={stats.weak_passwords}
              icon="exclamation"
              color="red"
              warning={stats.weak_passwords > 0}
            />
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <SearchBar
                placeholder="Search your vault..."
                onSearch={handleSearch}
                className="flex-1"
              />
              
              <div className="flex gap-4">
                {/* Item Type Filter */}
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

                {/* Category Filter */}
                <CategoryFilter
                  categories={categories || []}
                  selectedCategory={filters.category}
                  onCategoryChange={(category) => handleFilterChange({ category })}
                />

                {/* Favorites Filter */}
                <button
                  onClick={() => handleFilterChange({ 
                    favorite: filters.favorite === true ? undefined : true 
                  })}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    filters.favorite === true
                      ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ⭐ Favorites
                </button>
              </div>
            </div>

            <CreateItemButton />
          </div>
        </div>

        {/* Vault Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaultItems && vaultItems.length > 0 ? (
            vaultItems.map((item) => (
              <VaultItemCard
                key={item.id}
                item={item}
                categories={categories || []}
              />
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                title="No items found"
                description={
                  Object.values(filters).some(f => f)
                    ? "Try adjusting your filters to see more items."
                    : "Start by creating your first vault item."
                }
                actionText="Create Item"
                onAction={() => {/* Open create modal */}}
              />
            </div>
          )}
        </div>

        {/* Security Insights */}
        {stats && (stats.weak_passwords > 0 || stats.compromised_passwords > 0) && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">
              🚨 Security Alerts
            </h3>
            <div className="space-y-2">
              {stats.weak_passwords > 0 && (
                <p className="text-red-700">
                  You have {stats.weak_passwords} weak password{stats.weak_passwords !== 1 ? 's' : ''} that should be updated.
                </p>
              )}
              {stats.compromised_passwords > 0 && (
                <p className="text-red-700">
                  You have {stats.compromised_passwords} compromised password{stats.compromised_passwords !== 1 ? 's' : ''} that need immediate attention.
                </p>
              )}
            </div>
            <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Review Security Issues
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ title, description, actionText, onAction }) => (
  <div className="text-center py-12">
    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-6">{description}</p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {actionText}
      </button>
    )}
  </div>
);

export default Dashboard;