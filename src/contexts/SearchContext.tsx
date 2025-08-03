import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define the types for search results
interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'fitness' | 'forex' | 'karate';
  url: string;
  createdAt: string;
}

interface SearchContextType {
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  showResults: boolean;
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
  toggleShowResults: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: React.ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      // Search in fitness programs
      const { data: fitnessData, error: fitnessError } = await supabase
        .from('fitness_programs')
        .select('*')
        .textSearch('name', query)
        .limit(5);

      if (fitnessError) throw fitnessError;

      // Search in forex signals
      const { data: forexData, error: forexError } = await supabase
        .from('forex_signals')
        .select('*')
        .textSearch('name', query)
        .limit(5);

      if (forexError) throw forexError;

      // Search in martial arts ranks
      const { data: karateData, error: karateError } = await supabase
        .from('martial_arts_ranks')
        .select('*')
        .textSearch('rank_name', query)
        .limit(5);

      if (karateError) throw karateError;

      // Format and combine results
      const formattedResults: SearchResult[] = [
        ...(fitnessData || []).map((item) => ({
          id: item.id,
          title: item.name || 'Fitness Program',
          description: item.description || '',
          type: 'fitness' as const,
          url: `/fitness-training?program=${item.id}`,
          createdAt: item.created_at,
        })),
        ...(forexData || []).map((item) => ({
          id: item.id,
          title: `${item.currency_pair} ${item.signal_type}` || 'Forex Signal',
          description: item.description || '',
          type: 'forex' as const,
          url: `/forex-trading?signal=${item.id}`,
          createdAt: item.created_at,
        })),
        ...(karateData || []).map((item) => ({
          id: item.id,
          title: item.rank_name || 'Martial Arts Rank',
          description: item.discipline || '',
          type: 'karate' as const,
          url: `/karate-training?rank=${item.id}`,
          createdAt: item.date_achieved || item.created_at,
        })),
      ];

      // Sort by relevance (for now, just by date)
      formattedResults.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      setSearchResults(formattedResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  }, []);

  const toggleShowResults = useCallback(() => {
    setShowResults(prev => !prev);
  }, []);

  const value = {
    searchQuery,
    searchResults,
    isSearching,
    showResults,
    setSearchQuery,
    performSearch,
    clearSearch,
    toggleShowResults,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};