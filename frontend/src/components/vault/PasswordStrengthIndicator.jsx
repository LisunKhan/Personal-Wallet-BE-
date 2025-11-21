import React from 'react';

const PasswordStrengthIndicator = ({ password, className = '' }) => {
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'No password', color: 'gray' };
    
    let score = 0;
    
    // Length check
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    
    // Character variety checks
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    
    // Determine strength level
    if (score <= 2) return { score, label: 'Weak', color: 'red' };
    if (score <= 4) return { score, label: 'Medium', color: 'yellow' };
    return { score, label: 'Strong', color: 'green' };
  };

  const strength = calculateStrength(password);
  
  const getColorClasses = (color) => {
    switch (color) {
      case 'red':
        return 'bg-red-500 text-red-700';
      case 'yellow':
        return 'bg-yellow-500 text-yellow-700';
      case 'green':
        return 'bg-green-500 text-green-700';
      default:
        return 'bg-gray-300 text-gray-500';
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <div
            key={level}
            className={`h-2 w-4 rounded-sm ${
              level <= strength.score
                ? getColorClasses(strength.color).split(' ')[0]
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <span className={`text-sm font-medium ${getColorClasses(strength.color).split(' ')[1]}`}>
        {strength.label}
      </span>
    </div>
  );
};

export default PasswordStrengthIndicator;