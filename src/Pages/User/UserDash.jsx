import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import StudentNavbar from './StudentNavbar';
import UpcomingExams from '@/components/component/UpcomingExams';
import UserNavbar from './UserNavbar';

export default function UserDash() {
    const [upcomingExams, setUpcomingExams] = useState([]);

    useEffect(() => {
        const fetchUpcomingExams = async () => {
            try {
                const response = await fetch('https://examination-center.onrender.com/exams/users');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json(); // Parse the JSON data from the response

                // Reverse the array to show the latest exams on top
                const reversedExams = data.reverse();

                setUpcomingExams(reversedExams); // Set the state with the reversed data
            } catch (error) {
                console.error('Error fetching upcoming exams:', error);
            }
        };

        fetchUpcomingExams();
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
            {/* Top Navbar */}
            <StudentNavbar />

            <div className="flex flex-1">
                {/* Left Sidebar */}
                <UserNavbar />

                {/* Main Content */}
                <div className="flex-1 flex flex-col bg-background "> {/* Adjust ml-60 according to the width of the sidebar */}
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
                                                <TableHead>Performance</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Math Exam</TableCell>
                                                <TableCell>85%</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">Excellent</Badge>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>English Test</TableCell>
                                                <TableCell>78%</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">Good</Badge>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Science Quiz</TableCell>
                                                <TableCell>92%</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">Outstanding</Badge>
                                                </TableCell>
                                            </TableRow>
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
