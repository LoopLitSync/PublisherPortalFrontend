import { useState } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = event.target.value;
        setQuery(newQuery);
        onSearch(newQuery);
    };

    return (
        <div className="flex justify-center m-5">
            <input
                type="text"
                placeholder="Search books..."
                value={query}
                onChange={handleChange}
                className="w-full p-3 bg-white border-2 border-[#8075FF] rounded"
            />
        </div>
    );
};

export default SearchBar;