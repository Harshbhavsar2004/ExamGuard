import React, { useState, useEffect, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import StudentNavbar from './StudentNavbar';
import UpcomingExams from '@/components/component/UpcomingExams';
import UserNavbar from './UserNavbar';
import { LoginContext } from '@/components/Context/Context';

export default function UserDash() {
    const { logindata } = useContext(LoginContext);

    const [upcomingExams, setUpcomingExams] = useState([]);
    const [pastExams, setPastExams] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUpcomingExams = async () => {
            try {
                const response = await fetch('https://examination-center.onrender.com/api/exams/created-exams');
                if (!response.ok) {
                    throw new Error('Failed to fetch upcoming exams');
                }
                const data = await response.json();
                setUpcomingExams(data.reverse());
            } catch (err) {
                console.error('Error fetching upcoming exams:', err);
                setError('Unable to fetch upcoming exams.');
            }
        };
        fetchUpcomingExams();
    }, [logindata]);

    return (
        <div className="flex min-h-screen flex-col">
            {/* Top Navbar */}
            <StudentNavbar />

            <div className="flex flex-1">
                {/* Left Sidebar */}
                <UserNavbar />

                {/* Main Content */}
                <div className="flex-1 flex flex-col bg-background">
                    <main className="flex-1 px-4 py-6 sm:px-6">
                        <div className="grid gap-6">
                            {/* Upcoming Exams */}
                            <UpcomingExams upcomingExams={upcomingExams} />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
