import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange, className = '' }) => {
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

  return (
    <select
      value={selectedCategory}
      onChange={(e) => onCategoryChange(e.target.value)}
      className={`form-select form-control-custom ${className}`}
    >
      <option value="">All Categories</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {getTypeIcon(category.category_type)} {category.name}
        </option>
      ))}
    </select>
  );
};

export default CategoryFilter;