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
                const response = await fetch('https://examination-center.onrender.com/exams/users');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const reversedExams = data.reverse();
                setUpcomingExams(reversedExams);
            } catch (error) {
                console.error('Error fetching upcoming exams:', error);
            }
        };

        const fetchResults = async () => {
            try {
                if (!logindata || !logindata.ValidUserOne) {
                    return;
                }
                const encodedName = encodeURIComponent(logindata.ValidUserOne.email);
                const response = await fetch(`https://examination-center.onrender.com/results?name=${encodedName}`);
                if (!response.ok) {
                    throw new Error('Results not found');
                }
                const data = await response.json();               
                setPastExams(data);
            } catch (err) {
                setError(err.message);
            }
        };

        if (logindata && logindata.ValidUserOne && logindata.ValidUserOne.email) {
            fetchResults();
        }

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
                            <UpcomingExams upcomingExams={upcomingExams} />
                            <Card>
                                <CardHeader>
                                    <CardTitle>Past Exam Results</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Exam</TableHead>
                                                <TableHead>Score</TableHead>
                                                <TableHead>Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pastExams.length > 0 ? (
                                                pastExams.map((exam, index) => (
                                                    <TableRow key={exam._id || index}>
                                                        <TableCell>{exam.exam.title || 'Unknown Title'}</TableCell>
                                                        <TableCell>{exam.exam.Users[exam.exam.Users.length - 1]?.score || 'No Score'}%</TableCell>
                                                        <TableCell>{new Date(exam.exam.date).toLocaleDateString() || 'No Date'}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan="3" className="text-center">No past exam results available</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
