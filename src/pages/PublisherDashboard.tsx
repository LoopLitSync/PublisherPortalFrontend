import React, { useState } from 'react';
import BookTable from '../components/BookTable';
import SearchBar from '../components/SearchBar';

const PublisherDashboard: React.FC = () => {
    const [query, setQuery] = useState('');
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Submitted Books</h1>

            <SearchBar onSearch={setQuery}></SearchBar>

            <BookTable searchQuery={query}/>
        </div>
    );
};

export default PublisherDashboard;
