import React, { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../hooks/useVault';
import LoadingSpinner from '../common/LoadingSpinner';

const CategoryManager = ({ onClose }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter categories based on search term
  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="modal modal-custom d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center py-5">
              <LoadingSpinner />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal modal-custom d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content modal-content-custom">
          {/* Header */}
          <div className="modal-header border-0 pb-0 gradient-bg text-white">
            <div className="w-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="modal-title h3 fw-bold text-white mb-0">🏷️ Category Manager</h2>
                <button onClick={onClose} className="btn-close btn-close-white" aria-label="Close"></button>
              </div>
              <p className="text-white-50 mb-0">Organize your vault items with custom categories</p>
            </div>
          </div>

          <div className="modal-body p-4">
            {/* Action Bar */}
            <div className="row g-3 mb-4 align-items-center">
              <div className="col-md-6">
                <div className="position-relative">
                  <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                    <svg width="16" height="16" className="text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="🔍 Search categories..."
                    className="form-control form-control-custom ps-5"
                  />
                </div>
              </div>
              <div className="col-md-6 text-md-end">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn btn-primary-custom btn-custom"
                >
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Category
                </button>
              </div>
            </div>

            {/* Create/Edit Form */}
            {(showCreateForm || editingCategory) && (
              <div className="mb-4">
                <CategoryForm
                  category={editingCategory}
                  onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
                  onCancel={() => {
                    setShowCreateForm(false);
                    setEditingCategory(null);
                  }}
                  isLoading={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                />
              </div>
            )}

            {/* Categories Grid */}
            {filteredCategories.length > 0 ? (
              <div className="row g-4">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="col-lg-4 col-md-6 col-sm-12">
                    <CategoryCard
                      category={category}
                      onEdit={setEditingCategory}
                      onDelete={handleDeleteCategory}
                      isDeleting={deleteCategoryMutation.isPending}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyCategoriesState 
                onCreateCategory={() => setShowCreateForm(true)}
                hasSearchTerm={searchTerm.length > 0}
              />
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 pt-0">
            <div className="d-flex justify-content-between align-items-center w-100">
              <small className="text-muted">
                {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'} 
                {searchTerm && ' found'}
              </small>
              <button
                onClick={onClose}
                className="btn btn-outline-secondary btn-custom"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyCategoriesState = ({ onCreateCategory, hasSearchTerm }) => (
  <div className="text-center py-5 fade-in">
    <div className="card card-custom border-0 shadow-lg">
      <div className="card-body p-5">
        <div className="mb-4">
          <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '100px', height: '100px'}}>
            {hasSearchTerm ? (
              <svg width="50" height="50" className="text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            ) : (
              <svg width="50" height="50" className="text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            )}
          </div>
        </div>
        <h3 className="h2 fw-bold text-dark-override mb-3">
          {hasSearchTerm ? 'No categories found' : 'No categories yet'}
        </h3>
        <p className="text-muted mb-4 lead">
          {hasSearchTerm 
            ? 'Try adjusting your search terms or create a new category.'
            : 'Create your first category to organize your vault items by type, purpose, or any system that works for you.'
          }
        </p>
        {!hasSearchTerm && (
          <button
            onClick={onCreateCategory}
            className="btn btn-primary-custom btn-lg btn-custom"
          >
            <svg className="me-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Your First Category
          </button>
        )}
      </div>
    </div>
  </div>
);

// Category Form Component
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
    { color: '#3B82F6', name: 'Blue' },
    { color: '#10B981', name: 'Green' },
    { color: '#F59E0B', name: 'Yellow' },
    { color: '#EF4444', name: 'Red' },
    { color: '#8B5CF6', name: 'Purple' },
    { color: '#F97316', name: 'Orange' },
    { color: '#06B6D4', name: 'Cyan' },
    { color: '#84CC16', name: 'Lime' },
  ];

  return (
    <div className="card card-custom border-primary slide-up">
      <div className="card-header bg-primary bg-opacity-10 border-primary">
        <h4 className="card-title mb-0 text-dark-override fw-bold">
          {category ? '✏️ Edit Category' : '✨ Create New Category'}
        </h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark-override">Category Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="form-control form-control-custom"
                placeholder="e.g., Work, Personal, Banking"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark-override">Category Type</label>
              <select
                value={formData.category_type}
                onChange={(e) => setFormData(prev => ({ ...prev, category_type: e.target.value }))}
                className="form-select form-control-custom"
                required
              >
                {categoryTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold text-dark-override">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="form-control form-control-custom"
                rows="2"
                placeholder="Optional description to help identify this category..."
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold text-dark-override mb-3">Category Color</label>
              <div className="d-flex flex-wrap gap-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: option.color }))}
                    className={`btn p-0 border-0 position-relative ${
                      formData.color === option.color ? 'shadow-lg' : ''
                    }`}
                    style={{ width: '40px', height: '40px' }}
                    title={option.name}
                  >
                    <div
                      className="w-100 h-100 rounded-circle"
                      style={{ backgroundColor: option.color }}
                    />
                    {formData.color === option.color && (
                      <div className="position-absolute top-50 start-50 translate-middle">
                        <svg width="16" height="16" className="text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline-secondary btn-custom flex-fill"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary-custom btn-custom flex-fill"
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
                  {category ? 'Update Category' : 'Create Category'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Category Card Component
const CategoryCard = ({ category, onEdit, onDelete, isDeleting }) => {
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
    <div className="card card-custom h-100 fade-in">
      <div className="card-body d-flex flex-column">
        {/* Category Header */}
        <div className="d-flex align-items-center mb-3">
          <div
            className="rounded-circle me-3 d-flex align-items-center justify-content-center"
            style={{ 
              backgroundColor: category.color, 
              width: '48px', 
              height: '48px',
              color: 'white',
              fontSize: '20px'
            }}
          >
            {getTypeIcon(category.category_type)}
          </div>
          <div className="flex-grow-1">
            <h5 className="card-title mb-1 text-dark-override fw-bold">{category.name}</h5>
            <small className="text-muted">{getTypeLabel(category.category_type)}</small>
          </div>
        </div>

        {/* Category Description */}
        {category.description && (
          <p className="card-text text-muted mb-3 flex-grow-1">
            {category.description}
          </p>
        )}

        {/* Category Stats */}
        <div className="mb-3">
          <div className="d-flex align-items-center text-muted">
            <svg className="me-2" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <small>Category ID: {category.id}</small>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2 mt-auto">
          <button
            onClick={() => onEdit(category)}
            className="btn btn-outline-primary btn-sm flex-fill"
            title="Edit category"
          >
            <svg className="me-1" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(category.id)}
            disabled={isDeleting}
            className="btn btn-outline-danger btn-sm flex-fill"
            title="Delete category"
          >
            {isDeleting ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <>
                <svg className="me-1" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;