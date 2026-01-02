import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

const SearchBar = ({ onSearch, placeholder = "Search tasks...", className }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className={className}>
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        {searchTerm && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="p-0 h-auto"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;