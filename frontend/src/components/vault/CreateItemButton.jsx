import React, { useState } from 'react';

const CreateItemButton = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const itemTypes = [
    { type: 'password', label: 'Password', icon: '🔑' },
    { type: 'note', label: 'Secure Note', icon: '📝' },
    { type: 'card', label: 'Credit Card', icon: '💳' },
    { type: 'identity', label: 'Identity', icon: '👤' },
    { type: 'document', label: 'Document', icon: '📄' },
  ];

  const handleCreateItem = (type) => {
    // TODO: Implement create item functionality
    console.log('Creating item of type:', type);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Item
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-2">
              {itemTypes.map((item) => (
                <button
                  key={item.type}
                  onClick={() => handleCreateItem(item.type)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center"
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateItemButton;