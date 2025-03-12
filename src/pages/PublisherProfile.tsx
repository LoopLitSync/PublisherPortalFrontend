import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { Publisher } from '../models/Publisher';
import { fetchPublisherById } from '../api/PublisherService';
import { useParams } from "react-router-dom";

const PublisherProfile: React.FC = () => {
    const { id } = useParams(); // Retrieve the ID from URL params
    // console.log("useParams: " + id);
    const [publisher, setPublisher] = useState<Publisher | null>(null); // Publisher state

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        }
    });
    
    useEffect(() => {
        // console.log('Fetching publisher for id:', id); // Check if id is being passed
        if (id) {
            fetchPublisherById(Number(id))
                .then((data) => {
                    // console.log('Fetched publisher:', data); // Log the fetched data
                    setPublisher(data);
                })
                .catch((error) => {
                    console.error('Error fetching publisher:', error);
                });
        }
    }, [id]);
    
    if (!publisher) {
        // Loading state
        return <p className="text-center mt-10">Loading publisher details...</p>;
    }

    return (
        <div>
            <div className="flex h-screen items-center justify-center gap-10">
                <div className="flex flex-col gap-4">
                    <h1 className="font-bold text-2xl">{publisher.name}</h1>
                    <div className="flex flex-row gap-2">
                        <p className="font-bold">Email:</p>
                        <p>{publisher.email}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button text="Change e-mail" />
                        <Button text="Change password" />
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    {publisher.picture ? (
                        <img className="rounded-full" src={publisher.picture} alt={publisher.name} />
                    ) : (
                        <img className="rounded-full" src="/default_user.png" />
                    )}
                    <Button text="Upload picture" />
                </div>
            </div>
        </div>
    );
};

export default PublisherProfile;
