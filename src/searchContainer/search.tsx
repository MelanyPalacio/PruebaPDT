import React, { useState, useRef, useEffect } from 'react';
import { City } from '../common/types/city';

interface CitySelectProps {
  value?: City | null;
  onChange?: (city: City | null) => void;
}

const CitySelect = ({ value, onChange }: CitySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [query, setQuery] = useState(value ? `${value.nameCity} (${value.codeIataCity})` : '');
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setQuery(`${value.nameCity} (${value.codeIataCity})`);
    } else {
      setQuery('');
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCities = async (searchQuery: string) => {
    if (searchQuery.length < 2) return;
    setIsLoading(true);
    try {
      const response = await fetch('https://staging.travelflight.aiop.com.co/api/airports/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: searchQuery
        })
      });
      const data = await response.json();
      setCities(data.cities);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
    setIsOpen(true);
    onChange?.(null); // Clear selection when user starts typing
    fetchCities(inputValue);
  };

  const handleSelect = (city: City) => {
    onChange?.(city);
    setQuery(`${city.nameCity} (${city.codeIataCity})`);
    setIsOpen(false);
  };

  const clearSelection = () => {
    onChange?.(null);
    setQuery('');
    setCities([]);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for a city..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20"
        />
        {value && (
          <button
            onClick={clearSelection}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg border shadow-lg max-h-64 overflow-auto">
          {isLoading ? (
            <div className="px-4 py-2 text-gray-500">Loading...</div>
          ) : cities.length > 0 ? (
            cities.map((city) => (
              <div
                key={city.cityId}
                onClick={() => handleSelect(city)}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                  value?.cityId === city.cityId ? 'bg-blue-50' : ''
                }`}
              >
                {city.nameCity} ({city.codeIataCity})
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">
              {query.length < 2 ? 'Type to search...' : 'No cities found'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CitySelect;