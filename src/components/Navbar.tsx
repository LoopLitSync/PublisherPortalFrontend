import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import keycloak from '../keycloak';
import { Publisher } from '../models/Publisher';
// import { fetchPublisherById } from '../api/PublisherService';


const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [publisher, setPublisher] = useState<Publisher | null>(null); 

    useEffect(() => {
        const currentPublisher = localStorage.getItem("loggedInPublisher");
        if (currentPublisher) {
            setPublisher(JSON.parse(currentPublisher));
        }
    }, []);

    // useEffect(() => {
    //     // fetchPublisherById(publisher.id).then(setPublisher); 
    //     fetchPublisherById(1).then(setPublisher); 
    // }, []);


    const profileMenuRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => { 
        keycloak.logout({ redirectUri: window.location.origin }); 
        localStorage.clear();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target as Node)
            ) {
                setIsProfileMenuOpen(false);
            }
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getNavLinkClasses = (isActive: boolean) =>
        `px-4 py-5 ${isActive ? "bg-darkgreen text-white" : "text-white hover:bg-neturalgreen"}`;

    if (!publisher) {
        return <p>Loading publisher...</p>; 
    }

    return (
        <nav className="bg-teal-500 relative">
            <div className="min-h-13 px-4 flex justify-between items-center">
                <div className="flex items-center space-x-6">
                    <div className="text-white font-bold text-xl">
                        <NavLink to="/" className="flex items-center space-x-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                                />
                            </svg>
                            <span>Publisher Portal</span>
                        </NavLink>
                    </div>
                    <div className="hidden md:flex">
                        <NavLink to="/book-submission" className={({ isActive }) => getNavLinkClasses(isActive)}>
                            Book Submission
                        </NavLink>
                        <NavLink to="/publisher-dashboard" className={({ isActive }) => getNavLinkClasses(isActive)}>
                            Publisher Dashboard
                        </NavLink>
                    </div>
                </div>

                <div className="md:hidden flex relative ml-auto mr-3" ref={mobileMenuRef}>
                    <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="flex items-center space-x-2 text-white focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {isMenuOpen && (
                        <div className="md:hidden absolute right-0 mt-9 w-30 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <NavLink to="/book-submission" className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                                onClick={() => setIsMenuOpen(false)}>
                                Submission
                            </NavLink>
                            <NavLink to="/publisher-dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                                onClick={() => setIsMenuOpen(false)}>
                                Dashboard
                            </NavLink>
                        </div>
                    )}
                </div>

                <div className="flex relative" ref={profileMenuRef}>
                    <button
                        onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                        className="flex items-center space-x-2 text-white focus:outline-none" style={{ cursor: "pointer" }}>
                        <span className="hidden md:block">Welcome, {publisher.name}</span>
                        <img
                            src="/default_user.png"
                            alt="Profile"
                            className="w-10 h-10 right-3 rounded-full border border-white" />

                    </button>

                    {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-11 w-35 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <NavLink
                                to={`/publisher-profile/${publisher.id}`}
                                className="flex items-center px-4 py-2 text-gray-700 space-x-2 hover:bg-gray-200"
                                onClick= {() => setIsProfileMenuOpen(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                <span>My Profile</span>
                            </NavLink>
                            <button
                                className="flex items-center px-4 py-2 w-full text-red-600 hover:bg-gray-200" style={{ cursor: "pointer" }}
                                onClick={() => {
                                    handleLogout();
                                    setIsProfileMenuOpen(false);
                                }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                </svg>
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
