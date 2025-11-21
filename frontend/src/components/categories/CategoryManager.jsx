import React, { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../hooks/useVault';
import LoadingSpinner from '../common/LoadingSpinner';

const CategoryManager = ({ onClose }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const { data: categories, isLoading } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const handleCreateCategory = async (categoryData) => {
    try {
      await createCategoryMutation.mutateAsync(categoryData);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleUpdateCategory = async (categoryData) => {
    try {
      await updateCategoryMutation.mutateAsync({
        categoryId: editingCategory.id,
        categoryData
      });
      setEditingCategory(null);
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? Items in this category will become uncategorized.')) {
      try {
        await deleteCategoryMutation.mutateAsync(categoryId);
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Manage Categories</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Create Category Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Category
          </button>
        </div>

        {/* Create/Edit Form */}
        {(showCreateForm || editingCategory) && (
          <CategoryForm
            category={editingCategory}
            onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
            onCancel={() => {
              setShowCreateForm(false);
              setEditingCategory(null);
            }}
            isLoading={createCategoryMutation.isPending || updateCategoryMutation.isPending}
          />
        )}

        {/* Categories List */}
        <div className="space-y-3">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={setEditingCategory}
                onDelete={handleDeleteCategory}
                isDeleting={deleteCategoryMutation.isPending}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No categories yet. Create your first category to organize your vault items.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CategoryForm = ({ category, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    color: category?.color || '#3B82F6',
    category_type: category?.category_type || 'password',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const categoryTypeOptions = [
    { value: 'password', label: 'Password', icon: '🔑' },
    { value: 'document', label: 'Document', icon: '📄' },
    { value: 'note', label: 'Note', icon: '📝' },
    { value: 'card', label: 'Payment Card', icon: '💳' },
    { value: 'identity', label: 'Identity', icon: '👤' },
  ];

  const colorOptions = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {category ? 'Edit Category' : 'Create New Category'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Work, Personal, Banking"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category Type</label>
          <select
            value={formData.category_type}
            onChange={(e) => setFormData(prev => ({ ...prev, category_type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {categoryTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="2"
            placeholder="Optional description..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <div className="flex gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, color }))}
                className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : (category ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
};

const CategoryItem = ({ category, onEdit, onDelete, isDeleting }) => {
  const getTypeIcon = (type) => {
    const icons = {
      password: '🔑',
      document: '📄',
      note: '📝',
      card: '💳',
      identity: '👤',
    };
    return icons[type] || '📁';
  };

  const getTypeLabel = (type) => {
    const labels = {
      password: 'Password',
      document: 'Document',
      note: 'Note',
      card: 'Payment Card',
      identity: 'Identity',
    };
    return labels[type] || type;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getTypeIcon(category.category_type)}</span>
          <div>
            <h4 className="font-medium text-gray-900">{category.name}</h4>
            <p className="text-sm text-gray-500">
              {getTypeLabel(category.category_type)}
              {category.description && ` • ${category.description}`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onEdit(category)}
          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          title="Edit category"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(category.id)}
          disabled={isDeleting}
          className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
          title="Delete category"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CategoryManager;