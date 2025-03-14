import React, { useEffect } from 'react';
import Button from '../components/Button';
import { useAuth } from '../AuthContext';

const PublisherProfile: React.FC = () => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        }
    });

    const { publisher } = useAuth();

    if (!publisher) {
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
