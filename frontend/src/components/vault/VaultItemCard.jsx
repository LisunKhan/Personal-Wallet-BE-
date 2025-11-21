import React, { useState } from 'react';
import { useToggleFavorite, useDeleteVaultItem } from '../../hooks/useVault';
import { formatDistanceToNow } from 'date-fns';
import ItemTypeIcon from './ItemTypeIcon';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import FileList from '../files/FileList';

const VaultItemCard = ({ item, categories }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleFavoriteMutation = useToggleFavorite();
  const deleteItemMutation = useDeleteVaultItem();

  const category = categories.find(cat => cat.id === item.category);

  const handleToggleFavorite = () => {
    toggleFavoriteMutation.mutate(item.id);
  };

  const handleDelete = () => {
    deleteItemMutation.mutate(item.id);
    setShowDeleteConfirm(false);
  };

  const getItemTypeColor = (type) => {
    const colors = {
      password: 'blue',
      document: 'green',
      note: 'purple',
      card: 'orange',
      identity: 'pink',
    };
    return colors[type] || 'gray';
  };

  const color = getItemTypeColor(item.item_type);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <ItemTypeIcon type={item.item_type} className={`w-8 h-8 text-${color}-600`} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {item.name}
              </h3>
              {category && (
                <span 
                  className="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1"
                  style={{ 
                    backgroundColor: `${category.color}20`,
                    color: category.color 
                  }}
                >
                  {category.name}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              disabled={toggleFavoriteMutation.isLoading}
              className={`p-2 rounded-lg transition-colors ${
                item.is_favorite
                  ? 'text-yellow-500 hover:text-yellow-600'
                  : 'text-gray-400 hover:text-yellow-500'
              }`}
            >
              <svg className="w-5 h-5" fill={item.is_favorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>

            {/* More Options */}
            <div className="relative">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Item Specific Info */}
        <div className="space-y-3">
          {/* Password Strength (for password items) */}
          {item.item_type === 'password' && item.password_strength && (
            <PasswordStrengthIndicator strength={item.password_strength} />
          )}

          {/* Compromised Warning */}
          {item.is_compromised && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm font-medium">Compromised Password</span>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Files Count */}
          {item.files_count > 0 && (
            <div className="flex items-center space-x-2 text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span className="text-sm">{item.files_count} file{item.files_count !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              Updated {formatDistanceToNow(new Date(item.updated_at), { addSuffix: true })}
            </span>
            {item.last_used && (
              <span>
                Used {formatDistanceToNow(new Date(item.last_used), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="space-y-4">
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => {/* Open edit modal */}}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => {/* Open view modal */}}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                View
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>

            {/* Files (if any) */}
            {item.files_count > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Attached Files</h4>
                <FileList itemId={item.id} />
              </div>
            )}

            {/* Additional Info */}
            <div className="text-xs text-gray-500 space-y-1">
              <div>Created: {new Date(item.created_at).toLocaleDateString()}</div>
              <div>ID: {item.id}</div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete {item.name}?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. This will permanently delete the item and all associated files.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteItemMutation.isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteItemMutation.isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultItemCard;