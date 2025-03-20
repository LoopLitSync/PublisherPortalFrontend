import { useEffect, useState } from "react";
import { debounce } from "lodash";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    useEffect(() => {
        const debouncedSearch = debounce(() => {
          onSearch(query);
        }, 500); 

        debouncedSearch();

        return () => debouncedSearch.cancel();
    }, [query, onSearch]);

    return (
        <div className="flex justify-center m-5">
            <input
                type="text"
                placeholder="Search books..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 bg-white border-2 border-[#8075FF] rounded"
            />
        </div>
    );
};

export default SearchBar;