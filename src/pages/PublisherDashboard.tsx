import React from 'react';
import BookTable from '../components/BookTable';

const PublisherDashboard: React.FC = () => {
    return (
        <div>
            <h1>Submitted Books</h1>
            <BookTable></BookTable>
        </div>
    );
};

export default PublisherDashboard;