import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const getNavLinkClasses = (isActive: boolean) =>
        `px-4 py-5 ${isActive ? "bg-darkgreen text-white" : "text-white hover:bg-neturalgreen"}`;


    return (
        <nav className="bg-teal-500 relative">
            <div className="min-h-13 px-4 flex justify-between items-center">
                {/* Logo */}
                <div className="text-white font-bold text-xl">
                    <NavLink to="/" className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
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
                    <NavLink to="/publisher-profile" className={({ isActive }) => getNavLinkClasses(isActive)}>
                        Publisher Profile
                    </NavLink>
                </div>

                <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-white"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden absolute top-full right-3 bg-alabaster shadow shadow-grey-400 rounded-lg p-4 md:p-0 mt-2 flex flex-col space-y-1 z-10">
                    <NavLink to="/book-submission" className="px-3 py-1 text-dimgrey hover:bg-seagreen hover:text-white md:p-0">
                        Book Submission
                    </NavLink>
                    <NavLink to="/publisher-dashboard" className="px-3 py-1 text-dimgrey hover:bg-seagreen hover:text-white md:p-0">
                        Publisher Dashboard
                    </NavLink>
                    <NavLink to="/publisher-profile" className="px-3 py-1 text-dimgrey hover:bg-seagreen hover:text-white md:p-0">
                        Publisher Profile
                    </NavLink>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
