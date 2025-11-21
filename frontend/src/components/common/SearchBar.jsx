import React, { useState, useEffect } from 'react';

const SearchBar = ({ placeholder = 'Search...', onSearch, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // Debounce search

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, onSearch]);

  return (
    <div className={`position-relative ${className}`}>
      <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
        <svg width="16" height="16" className="text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="form-control form-control-custom ps-5"
      />
    </div>
  );
};

export default SearchBar;