import React from 'react';
import BookTable from '../components/BookTable';

const PublisherDashboard: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Submitted Books</h1>
            <BookTable />
        </div>
    );
};

export default PublisherDashboard;
