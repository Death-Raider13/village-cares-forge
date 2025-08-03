import React from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '@/contexts/SearchContext';
import { Loader2, Dumbbell, TrendingUp, Award, AlertCircle } from 'lucide-react';

const SearchResults: React.FC = () => {
  const { searchResults, isSearching, searchQuery } = useSearch();

  // Group results by type
  const fitnessResults = searchResults.filter(result => result.type === 'fitness');
  const forexResults = searchResults.filter(result => result.type === 'forex');
  const karateResults = searchResults.filter(result => result.type === 'karate');

  // Get icon based on result type
  const getIcon = (type: string) => {
    switch (type) {
      case 'fitness':
        return <Dumbbell className="h-4 w-4 text-vintage-burgundy" />;
      case 'forex':
        return <TrendingUp className="h-4 w-4 text-vintage-deep-blue" />;
      case 'karate':
        return <Award className="h-4 w-4 text-vintage-gold" />;
      default:
        return null;
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-vintage-gold/20 z-50 max-h-[70vh] overflow-y-auto">
      {isSearching ? (
        <div className="p-4 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-vintage-burgundy" />
          <p className="mt-2 text-sm text-vintage-dark-brown">Searching...</p>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="p-4 text-center">
          {searchQuery ? (
            <>
              <AlertCircle className="h-6 w-6 mx-auto text-vintage-dark-brown/50" />
              <p className="mt-2 text-sm text-vintage-dark-brown">No results found for "{searchQuery}"</p>
            </>
          ) : (
            <p className="text-sm text-vintage-dark-brown/70">Start typing to search</p>
          )}
        </div>
      ) : (
        <div className="py-2">
          {/* Fitness Results */}
          {fitnessResults.length > 0 && (
            <div className="mb-2">
              <div className="px-4 py-2 text-xs font-semibold text-vintage-dark-brown/70 uppercase tracking-wider bg-vintage-warm-cream/50">
                Fitness Programs
              </div>
              {fitnessResults.map(result => (
                <Link
                  key={`fitness-${result.id}`}
                  to={result.url}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-vintage-warm-cream/30 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon('fitness')}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-vintage-deep-blue">{result.title}</h4>
                    {result.description && (
                      <p className="text-xs text-vintage-dark-brown/70 mt-1 line-clamp-2">{result.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Forex Results */}
          {forexResults.length > 0 && (
            <div className="mb-2">
              <div className="px-4 py-2 text-xs font-semibold text-vintage-dark-brown/70 uppercase tracking-wider bg-vintage-warm-cream/50">
                Forex Signals
              </div>
              {forexResults.map(result => (
                <Link
                  key={`forex-${result.id}`}
                  to={result.url}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-vintage-warm-cream/30 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon('forex')}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-vintage-deep-blue">{result.title}</h4>
                    {result.description && (
                      <p className="text-xs text-vintage-dark-brown/70 mt-1 line-clamp-2">{result.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Karate Results */}
          {karateResults.length > 0 && (
            <div className="mb-2">
              <div className="px-4 py-2 text-xs font-semibold text-vintage-dark-brown/70 uppercase tracking-wider bg-vintage-warm-cream/50">
                Martial Arts
              </div>
              {karateResults.map(result => (
                <Link
                  key={`karate-${result.id}`}
                  to={result.url}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-vintage-warm-cream/30 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon('karate')}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-vintage-deep-blue">{result.title}</h4>
                    {result.description && (
                      <p className="text-xs text-vintage-dark-brown/70 mt-1 line-clamp-2">{result.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* View All Results Link */}
          {searchResults.length > 5 && (
            <div className="px-4 py-3 text-center border-t border-vintage-gold/10">
              <Link
                to={`/search?q=${encodeURIComponent(searchQuery)}`}
                className="text-sm text-vintage-burgundy hover:text-vintage-deep-blue transition-colors"
              >
                View all {searchResults.length} results
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;