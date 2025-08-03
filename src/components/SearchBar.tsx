import React, { useEffect, useRef, useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SearchResults from '@/components/SearchResults';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = '' }) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    performSearch, 
    clearSearch, 
    isSearching,
    showResults,
    toggleShowResults
  } = useSearch();
  
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchTerm = useDebounce(searchQuery, 300);

  // Perform search when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, performSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    clearSearch();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Close search results on Escape
    if (e.key === 'Escape') {
      clearSearch();
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-3 text-vintage-dark-brown/60">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
        
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          className="pl-10 pr-10 bg-white/80 border-vintage-gold/30 focus:border-vintage-gold focus:ring-vintage-gold/20"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          aria-label="Search"
        />
        
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 h-8 w-8 text-vintage-dark-brown/60 hover:text-vintage-dark-brown"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Search Results */}
      {showResults && searchQuery && <SearchResults />}
    </div>
  );
};

export default SearchBar;