// import { Search } from 'lucide-react';

// interface SearchBarProps {
//   placeholder: string;
//   value: string;
//   onChange: (value: string) => void;
// }

// export default function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
//   return (
//     <div className="relative ">
//       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
//       <input
//         type="text"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full pl-10 pr-4 py-2 rounded-full border border-primary-200 dark:border-primary-700 bg-white dark:bg-gray-900 text-primary-800 dark:text-primary-200 placeholder-primary-400"
//       />
//     </div>
//   );
// }

import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
}

export default function SearchBar({
  placeholder,
  value,
  onChange,
  suggestions,
}: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(value.toLowerCase())
  );

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // delay so click registers
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-full border border-primary-200 dark:border-primary-700 bg-white dark:bg-gray-900 text-primary-800 dark:text-primary-200 placeholder-primary-400"
      />

      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-700 rounded-lg shadow-md max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion) => (
            <li
              key={suggestion}
              onMouseDown={() => handleSelect(suggestion)}
              className="px-4 py-1 hover:bg-primary-100 dark:hover:bg-primary-700 cursor-pointer text-primary-800 dark:text-primary-200 text-sm"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
