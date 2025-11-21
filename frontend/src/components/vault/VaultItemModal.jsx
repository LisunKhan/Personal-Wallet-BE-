import React, { useState, useEffect } from 'react';
import { useUpdateVaultItem, useVaultItem } from '../../hooks/useVault';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import LoadingSpinner from '../common/LoadingSpinner';

const VaultItemModal = ({ itemId, mode = 'view', onClose, categories }) => {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    notes: '',
    // Password fields
    username: '',
    password: '',
    url: '',
    // Card fields
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    // Identity fields
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    tags: [],
  });

  const { data: item, isLoading, error } = useVaultItem(itemId);
  const updateItemMutation = useUpdateVaultItem();

  useEffect(() => {
    if (item) {
      let decryptedData = {};
      try {
        decryptedData = JSON.parse(item.encrypted_data || '{}');
      } catch (e) {
        console.error('Failed to parse encrypted data:', e);
      }

      setFormData({
        name: item.name || '',
        category: item.category || '',
        notes: decryptedData.notes || '',
        // Password fields
        username: decryptedData.username || '',
        password: decryptedData.password || '',
        url: decryptedData.url || '',
        // Card fields
        cardNumber: decryptedData.card_number || '',
        cardholderName: decryptedData.cardholder_name || '',
        expiryMonth: decryptedData.expiry_month || '',
        expiryYear: decryptedData.expiry_year || '',
        cvv: decryptedData.cvv || '',
        // Identity fields
        firstName: decryptedData.first_name || '',
        lastName: decryptedData.last_name || '',
        email: decryptedData.email || '',
        phone: decryptedData.phone || '',
        tags: item.tags || [],
      });
    }
  }, [item]);

  const handleSave = async () => {
    try {
      // Prepare encrypted data based on item type
      let encryptedData = {};
      
      if (item.item_type === 'password') {
        encryptedData = {
          username: formData.username,
          password: formData.password,
          url: formData.url,
          notes: formData.notes,
        };
      } else if (item.item_type === 'card') {
        encryptedData = {
          card_number: formData.cardNumber,
          cardholder_name: formData.cardholderName,
          expiry_month: formData.expiryMonth,
          expiry_year: formData.expiryYear,
          cvv: formData.cvv,
          notes: formData.notes,
        };
      } else if (item.item_type === 'identity') {
        encryptedData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          notes: formData.notes,
        };
      } else if (item.item_type === 'note') {
        encryptedData = {
          content: formData.notes,
          is_markdown: false,
        };
      }

      const itemData = {
        name: formData.name,
        item_type: item.item_type,
        category: formData.category || null,
        encrypted_data: JSON.stringify(encryptedData),
        tags: formData.tags,
      };

      await updateItemMutation.mutateAsync({ itemId, itemData });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update item:', error);
    }
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

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log(`${label} copied to clipboard`);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getItemTypeIcon = (type) => {
    const icons = {
      password: '🔑',
      document: '📄',
      note: '📝',
      card: '💳',
      identity: '👤',
    };
    return icons[type] || '📁';
  };

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

  if (error || !item) {
    return (
      <div className="modal modal-custom d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center py-5">
              <p className="text-danger">Failed to load item details</p>
              <button onClick={onClose} className="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal modal-custom d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content modal-content-custom">
          {/* Header */}
          <div className="modal-header border-0 pb-0">
            <div className="d-flex align-items-center">
              <span className="fs-2 me-3">{getItemTypeIcon(item.item_type)}</span>
              <div>
                <h2 className="modal-title h4 fw-bold text-dark-override mb-0">
                  {isEditing ? 'Edit Item' : 'View Item'}
                </h2>
                <small className="text-muted text-capitalize">{item.item_type}</small>
              </div>
            </div>
            <button onClick={onClose} className="btn-close" aria-label="Close"></button>
          </div>

          <div className="modal-body">
            {/* Basic Information */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-dark-override">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="form-control form-control-custom"
                />
              ) : (
                <div className="form-control-plaintext fw-medium text-dark-override">{item.name}</div>
              )}
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-dark-override">Category</label>
              {isEditing ? (
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="form-select form-control-custom"
                >
                  <option value="">No Category</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="form-control-plaintext text-dark-override">
                  {categories?.find(cat => cat.id === item.category)?.name || 'No Category'}
                </div>
              )}
            </div>

            {/* Type-specific fields */}
            {item.item_type === 'password' && (
              <>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark-override">Username/Email</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      className="form-control form-control-custom"
                    />
                  ) : (
                    <div className="d-flex align-items-center">
                      <div className="form-control-plaintext text-dark-override flex-grow-1">
                        {formData.username || 'Not set'}
                      </div>
                      {formData.username && (
                        <button
                          onClick={() => copyToClipboard(formData.username, 'Username')}
                          className="btn btn-outline-secondary btn-sm ms-2"
                          title="Copy username"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark-override">Password</label>
                  {isEditing ? (
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="form-control form-control-custom"
                      />
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="btn btn-success-custom"
                        title="Generate Password"
                      >
                        Generate
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="btn btn-outline-secondary"
                        title={showPassword ? "Hide Password" : "Show Password"}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {showPassword ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          )}
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center">
                      <div className="form-control-plaintext text-dark-override flex-grow-1 font-monospace">
                        {showPassword ? formData.password : '••••••••••••'}
                      </div>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="btn btn-outline-secondary btn-sm me-2"
                        title={showPassword ? "Hide Password" : "Show Password"}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {showPassword ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          )}
                        </svg>
                      </button>
                      {formData.password && (
                        <button
                          onClick={() => copyToClipboard(formData.password, 'Password')}
                          className="btn btn-outline-secondary btn-sm"
                          title="Copy password"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                  {formData.password && (
                    <div className="mt-2">
                      <PasswordStrengthIndicator password={formData.password} />
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark-override">Website URL</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                      className="form-control form-control-custom"
                    />
                  ) : (
                    <div className="d-flex align-items-center">
                      <div className="form-control-plaintext text-dark-override flex-grow-1">
                        {formData.url ? (
                          <a href={formData.url} target="_blank" rel="noopener noreferrer" className="text-primary">
                            {formData.url}
                          </a>
                        ) : (
                          'Not set'
                        )}
                      </div>
                      {formData.url && (
                        <button
                          onClick={() => copyToClipboard(formData.url, 'URL')}
                          className="btn btn-outline-secondary btn-sm ms-2"
                          title="Copy URL"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Notes */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-dark-override">Notes</label>
              {isEditing ? (
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="form-control form-control-custom"
                  rows="3"
                />
              ) : (
                <div className="form-control-plaintext text-dark-override">
                  {formData.notes || 'No notes'}
                </div>
              )}
            </div>

            {/* Metadata */}
            {!isEditing && (
              <div className="border-top pt-3">
                <div className="row g-3 text-muted small">
                  <div className="col-md-6">
                    <strong>Created:</strong> {new Date(item.created_at).toLocaleDateString()}
                  </div>
                  <div className="col-md-6">
                    <strong>Updated:</strong> {new Date(item.updated_at).toLocaleDateString()}
                  </div>
                  <div className="col-md-6">
                    <strong>ID:</strong> {item.id}
                  </div>
                  {item.last_used && (
                    <div className="col-md-6">
                      <strong>Last Used:</strong> {new Date(item.last_used).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer border-0 pt-0">
            <div className="d-flex gap-2 w-100">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn-outline-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={updateItemMutation.isPending}
                    className="btn btn-primary-custom"
                  >
                    {updateItemMutation.isPending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary-custom"
                  >
                    Edit Item
                  </button>
                  <button
                    onClick={onClose}
                    className="btn btn-outline-secondary"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultItemModal;