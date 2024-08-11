import Navbar from '@/components/component/Navbar';
import React, { useContext, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import toast, { Toaster } from 'react-hot-toast';
import { Calendar } from '@/components/ui/calendar';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '@/components/Context/Context';

const AddExam = () => {
    const {logindata} = useContext(LoginContext)
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const history = useNavigate();
    const user = logindata.ValidUserOne.email
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate inputs
        if (!title || !date || !startTime || !endTime) {
            toast.error('All fields are required.');
            return;
        }

        try {
            const token = localStorage.getItem('usersdatatoken');
            const response = await fetch('https://examination-center.onrender.com/exams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    Creater : user,
                    title,
                    date,
                    startTime,
                    endTime,
                    questions: [], // Initially no questions
                }),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success('Exam created successfully!');
                setTimeout(() => {
                    history(`/exams/${result.exam._id}`); // Redirect to add questions
                }, 1000);
            } else {
                const error = await response.json();
                toast.error(`Failed to create exam: ${error.message}`);
            }
        } catch (error) {
            toast.error('Failed to create exam.');
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-screen">
            <Navbar className="w-1/4" />
            <div className="ml-60 main-content flex-1">
                <hr className="border-t-2 border-muted" />
                <div className="p-4 flex justify-center h-full items-center">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>Create New Exam</CardTitle>
                            <CardDescription>Fill out the details to add a new exam.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Exam Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="Enter exam title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Exam Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start font-normal">
                                                    <CalendarDaysIcon className="mr-2 h-4 w-4" />
                                                    Pick a date
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={(selectedDate) => setDate(selectedDate)}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {date && (
                                            <div className="mt-2">
                                                <Label>Selected Date</Label>
                                                <p>{new Date(date).toLocaleDateString()}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="start-time">Start Time</Label>
                                        <Input
                                            id="start-time"
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end-time">End Time</Label>
                                        <Input
                                            id="end-time"
                                            type="time"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <CardFooter className="flex justify-end mt-10">
                                    <Button type="submit">Create Exam</Button>
                                </CardFooter>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default AddExam;

function CalendarDaysIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
            <path d="M8 14h.01" />
            <path d="M12 14h.01" />
            <path d="M16 14h.01" />
            <path d="M8 18h.01" />
            <path d="M12 18h.01" />
            <path d="M16 18h.01" />
        </svg>
    );
}
