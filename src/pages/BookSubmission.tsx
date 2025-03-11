import React from 'react';
import BookSubmissionForm from '../components/BookSubmissionForm';
import BookBulkUpload from '../components/BoobBulkUpload';

const BookSubmission: React.FC = () => {
    return (
        <div>
            <h1>Book Submission</h1>
            <div className='mb-7'>
            <BookBulkUpload></BookBulkUpload>
            </div>
            <div>
            <BookSubmissionForm></BookSubmissionForm>
            </div>
        </div>
    );
};

export default BookSubmission;