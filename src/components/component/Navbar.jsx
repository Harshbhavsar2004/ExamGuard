import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faTrophy, faCog, faThLarge } from '@fortawesome/free-solid-svg-icons'

// Navbar component
const Navbar = () => {
    return (
        <div className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white">
            <nav className="flex flex-col gap-1 p-4">
            <Link
                    to="/admin-dashboard"
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                    <FontAwesomeIcon icon={faThLarge} className="w-5 h-5" />
                    Dashboard
                </Link>
                <Link
                    to="/Users-Exams"
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                    <FontAwesomeIcon icon={faBook} className="w-5 h-5" />
                    Exams
                </Link>
                <Link
                    to="/add-exam"
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                    <FontAwesomeIcon icon={faTrophy} className="w-5 h-5" />
                    Create Exam
                </Link>
                <Link
                    to="/admin-setting"
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                    <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
                    Settings
                </Link>
                <Link
                    to="/adminExamsDetails"
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                    <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
                    Admin Exams Details
                </Link>

            </nav>
        </div>
    )
}

export default Navbar;
