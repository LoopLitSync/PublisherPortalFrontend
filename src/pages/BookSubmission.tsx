import React from 'react';
import BookSubmissionForm from '../components/BookSubmissionForm';

const BookSubmission: React.FC = () => {
    return (
        <div>
            <h1>Book Submission</h1>
            <BookSubmissionForm></BookSubmissionForm>
        </div>
    );
};

export default BookSubmission;