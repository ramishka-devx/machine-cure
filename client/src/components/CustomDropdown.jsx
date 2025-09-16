import React, { useState, useRef, useEffect } from 'react';

const CustomDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = "Select an option...",
  disabled = false,
  required = false,
  className = "",
  maxHeight = "200px",
  searchable = false,
  onSearch = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Filter options based on search term
  const filteredOptions = searchable && searchTerm
    ? options.filter(option => 
        option.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Debug: Log the options being rendered
  useEffect(() => {
    if (options.length > 0) {
      console.log('CustomDropdown received options:', options);
      console.log('Filtered options:', filteredOptions);
    }
  }, [options, filteredOptions]);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleSelect(filteredOptions[focusedIndex]);
        }
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
    }
  };

  // Handle option selection
  const handleSelect = (option) => {
    if (onChange) {
      onChange(option.value);
    }
    setIsOpen(false);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  // Handle dropdown toggle
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setFocusedIndex(-1);
      }
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    setFocusedIndex(-1);
    if (onSearch) {
      onSearch(term);
    }
  };

  // Get selected option display text
  const getSelectedText = () => {
    if (!value) return placeholder;
    const selectedOption = options.find(option => option.value === value);
    return selectedOption ? (selectedOption.label || selectedOption.displayName || selectedOption.value) : placeholder;
  };

  // Get option display text
  const getOptionText = (option) => {
    return option.label || option.displayName || option.value;
  };

  return (
    <div 
      ref={dropdownRef}
      className={`relative ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
    >
      {/* Dropdown Button/Header */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-left border border-gray-300 rounded-md 
          bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 
          focus:border-transparent flex items-center justify-between
          ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'hover:border-gray-400'}
          ${isOpen ? 'ring-2 ring-blue-500 border-transparent' : ''}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-required={required}
      >
        <span className="truncate">{getSelectedText()}</span>
        <svg 
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
          style={{ maxHeight, overflowY: 'auto' }}
          role="listbox"
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Options List */}
          {filteredOptions.length > 0 ? (
            <div className="py-1">
              {filteredOptions.map((option, index) => (
                <button
                  key={option.value || index}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50
                    focus:outline-none transition-colors font-mono text-sm
                    ${index === focusedIndex ? 'bg-blue-50' : ''}
                    ${option.value === value ? 'bg-blue-100 text-blue-800' : ''}
                    ${option.level === 0 ? 'font-semibold' : ''}
                  `}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {/* Custom content rendering */}
                  {option.customContent ? (
                    option.customContent
                  ) : (
                    <div className="flex items-center">
                      <span className="truncate">{getOptionText(option)}</span>
                      {option.subtitle && (
                        <span className="ml-2 text-xs text-gray-500">
                          {option.subtitle}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              {searchTerm ? 'No matching options found' : 'No options available'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;