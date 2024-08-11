import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
const UpcomingExams = ({upcomingExams}) => {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      };
      

      const calculateDuration = (startTime, endTime) => {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
      
        const startDate = new Date();
        startDate.setHours(startHours, startMinutes, 0);
      
        const endDate = new Date();
        endDate.setHours(endHours, endMinutes, 0);
      
        const durationMilliseconds = endDate - startDate;
        const durationMinutes = Math.round(durationMilliseconds / (1000 * 60)); // Convert to minutes
      
        return durationMinutes;
      };
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Exams</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Exam</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Duration</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {upcomingExams.length > 0 ? (
                                upcomingExams.map((exam) => (
                                    <TableRow key={exam.id}>
                                        <TableCell>{exam.title}</TableCell>
                                        <TableCell>{formatDate(exam.date)}</TableCell>
                                        <TableCell>{exam.startTime}</TableCell>
                                        <TableCell>{calculateDuration(exam.startTime, exam.endTime)} minutes</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="4">No upcoming exams</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card></div>
    )
}

export default UpcomingExams