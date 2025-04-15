import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { search } from "../apis/apiCalls";
import ProfileItem from "./ProfileItem";

const ProfileSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Debounced Search
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      setError(null);
      setIsOpen(true);

      try {
        const data = await search(query);
        setResults(data || []);
      } catch (error) {
        setError("Failed to fetch results. Please try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce delay (300ms)

    return () => clearTimeout(delaySearch);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.search-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="w-full max-w-md mx-auto relative search-container ">
      {/* Search Input */}
      <div className="relative ">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          placeholder="Search profiles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Loader2 size={18} className="animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* Dropdown Content */}
      {isOpen && query.trim() && (
        <div className="absolute mt-1 w-full border border-gray-200 rounded-lg overflow-hidden shadow-lg z-20 bg-white">
          {/* Loading State */}
          {loading && (
            <div className="p-4 flex items-center justify-center">
              <Loader2 size={24} className="animate-spin text-indigo-600 mr-2" />
              <div className="text-gray-600">Searching...</div>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="p-4 text-sm text-red-500">
              {error}
            </div>
          )}

          {/* Results */}
          {!loading && !error && results.length > 0 && (
            <div className="max-h-60 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {results.map((el, i) =>

                  <ProfileItem setIsOpen={setIsOpen} id={i} user={el} />
                )}
              </ul>
            </div>
          )}

          {/* No Results */}
          {!loading && !error && results.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileSearch;
