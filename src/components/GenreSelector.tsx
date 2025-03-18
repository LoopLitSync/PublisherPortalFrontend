interface GenreSelectorProps {
    availableGenres: string[];
    selectedGenres: string[];
    onGenreSelect: (genre: string) => void;
    onGenreRemove: (genre: string) => void;
    error?: string;
    className?: string;
};

const GenreSelector: React.FC<GenreSelectorProps> = ({ availableGenres, selectedGenres, onGenreSelect, onGenreRemove, error, className }) => {
    return (
      <div className={`flex flex-col space-y-2`}>
        <label className="text-lg">Genres</label>
        <select
          className={`w-full p-2 border rounded ${className}`}
          onChange={(e) => onGenreSelect(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Select Genre</option>
          {availableGenres.map((genre, index) => (
            <option key={index} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 text-sm">{error}</p>}
  
        <div className="flex gap-2 flex-wrap">
          {selectedGenres.map((genre, index) => (
            <span
              key={index}
              className="bg-[#ebe9ff] text-[#8075FF] px-2 py-1 rounded-full flex items-center gap-1"
            >
              {genre}
              <button
                type="button"
                className="text-[#8075FF] hover:text-[#3c3776]"
                onClick={() => onGenreRemove(genre)}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  };

export default GenreSelector;