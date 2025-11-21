import React, { useState } from 'react';
import { useGeneratePassword } from '../../hooks/useVault';
import { toast } from 'react-hot-toast';

const PasswordGenerator = ({ onPasswordGenerated, className = '' }) => {
  const [options, setOptions] = useState({
    length: 16,
    include_uppercase: true,
    include_lowercase: true,
    include_numbers: true,
    include_symbols: true,
    exclude_ambiguous: true,
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const generatePasswordMutation = useGeneratePassword();

  const handleGenerate = async () => {
    try {
      const result = await generatePasswordMutation.mutateAsync(options);
      setGeneratedPassword(result.password);
      
      if (onPasswordGenerated) {
        onPasswordGenerated(result.password);
      }
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleCopyPassword = async () => {
    if (generatedPassword) {
      try {
        await navigator.clipboard.writeText(generatedPassword);
        toast.success('Password copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy password');
      }
    }
  };

  const handleOptionChange = (option, value) => {
    setOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: 'None', color: 'gray' };
    
    let score = 0;
    
    // Length scoring
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 15;
    if (password.length >= 16) score += 10;
    
    // Character variety
    if (/[a-z]/.test(password)) score += 12.5;
    if (/[A-Z]/.test(password)) score += 12.5;
    if (/[0-9]/.test(password)) score += 12.5;
    if (/[^a-zA-Z0-9]/.test(password)) score += 12.5;
    
    if (score < 30) return { score, label: 'Weak', color: 'red' };
    if (score < 60) return { score, label: 'Fair', color: 'yellow' };
    if (score < 80) return { score, label: 'Good', color: 'blue' };
    return { score, label: 'Strong', color: 'green' };
  };

  const strength = getPasswordStrength(generatedPassword);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Password Generator</h3>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced
        </button>
      </div>

      {/* Generated Password Display */}
      {generatedPassword && (
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm break-all">
              {generatedPassword}
            </div>
            <button
              onClick={handleCopyPassword}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Copy to clipboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          {/* Password Strength Indicator */}
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-${strength.color}-500 transition-all duration-300`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
            <span className={`text-sm font-medium text-${strength.color}-600`}>
              {strength.label}
            </span>
          </div>
        </div>
      )}

      {/* Basic Options */}
      <div className="space-y-4 mb-6">
        {/* Password Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Length: {options.length}
          </label>
          <input
            type="range"
            min="4"
            max="128"
            value={options.length}
            onChange={(e) => handleOptionChange('length', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>4</span>
            <span>128</span>
          </div>
        </div>

        {/* Character Type Checkboxes */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.include_uppercase}
              onChange={(e) => handleOptionChange('include_uppercase', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Uppercase (A-Z)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.include_lowercase}
              onChange={(e) => handleOptionChange('include_lowercase', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Lowercase (a-z)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.include_numbers}
              onChange={(e) => handleOptionChange('include_numbers', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Numbers (0-9)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.include_symbols}
              onChange={(e) => handleOptionChange('include_symbols', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Symbols (!@#$)</span>
          </label>
        </div>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Advanced Options</h4>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.exclude_ambiguous}
              onChange={(e) => handleOptionChange('exclude_ambiguous', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Exclude ambiguous characters (0, O, 1, l, I)
            </span>
          </label>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={generatePasswordMutation.isLoading}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {generatePasswordMutation.isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Generating...</span>
          </div>
        ) : (
          'Generate Password'
        )}
      </button>

      {/* Password Tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Password Tips</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Use at least 12 characters for better security</li>
          <li>• Include a mix of character types</li>
          <li>• Avoid using personal information</li>
          <li>• Use unique passwords for each account</li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordGenerator;