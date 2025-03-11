import React, { useEffect } from 'react';
import Button from '../components/Button';

const PublisherProfile: React.FC = () => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        }
    });

    return (
        <div>
            <div className='flex h-screen items-center justify-center gap-10' >
                <div className='flex flex-col gap-4'>
                    <h1 className='font-bold text-2xl'>Publisher Name</h1>
                    <div className='flex flex-row gap-2'>
                        <p className='font-bold'>Email:</p>
                        <p>email@example.com</p>
                    </div>
                    <div className='flex gap-2'>
                        <Button text='Change e-mail'></Button>
                        <Button text='Change password'></Button>
                    </div>
                </div>
                <div className='flex flex-col gap-4'>
                    <img className='rounded-full' src='default_user.png'></img>
                    <Button text='Upload picture'></Button>
                </div>
            </div>
        </div>
    );
};

export default PublisherProfile;