import React, { useState, useEffect, useContext } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Navbar from "@/components/component/Navbar";
import AdminNavbar from './AdminNavbar';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '@/components/Context/Context';

export default function AdminDashboard() {
  const { logindata } = useContext(LoginContext); // Use the context to get logindata
  const [examsCount, setExamsCount] = useState(0);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [userCreatedExam, setUserCreatedExam] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('usersdatatoken');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        if (!logindata || !logindata.ValidUserOne) {
          return;
        }

        const response = await fetch(`https://examination-center.onrender.com/exams?email=${logindata.ValidUserOne.email}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const { exams } = data;

        const now = new Date();
        const upcoming = exams.filter(exam => new Date(exam.date) > now);
        const lastExam = exams[exams.length - 1];
        
        setUpcomingExams(upcoming);
        setExamsCount(exams.length);
        setUserCreatedExam(lastExam);
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    }

    if (logindata && logindata.ValidUserOne) {
      fetchDashboardData();
    }
  }, [token, logindata]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching
  }

  const handleDeleteExam = async (title) => {
    try {
      if (!logindata) {
        console.error('No login data available');
        return;
      }

      const response = await fetch(`https://examination-center.onrender.com/exams`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, email: logindata.email }), // Include email in the request body
      });

      if (!response.ok) {
        throw new Error('Failed to delete the exam');
      }

      const data = await response.json();
      console.log(data.message); // Handle success message

      // Update state to reflect the deletion
      setUpcomingExams(prevExams => prevExams.filter(exam => exam.title !== title));
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="ml-60 main-content flex-1 bg-muted/10 p-6">
        <AdminNavbar />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Total Exams</div>
              <BookIcon className="w-6 h-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{examsCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Total Students</div>
              <UsersIcon className="w-6 h-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2,345</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Average Exam Score</div>
              <AwardIcon className="w-6 h-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">84%</div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
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
                    <TableHead>Start Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.title}</TableCell>
                      <TableCell>{exam.date}</TableCell>
                      <TableCell>{exam.startTime}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                              <MoveHorizontalIcon className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate('/Users-Exams')}>View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteExam(exam.title)}>Cancel</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        {userCreatedExam && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Last Exam Created</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{userCreatedExam.name}</div>
                <div className="text-md">{userCreatedExam.date}</div>
                <div className="text-sm">Students: {userCreatedExam.students}</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}



function AwardIcon(props) {
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
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </svg>
  );
}

function BookIcon(props) {
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
      <path d="M2 19.5V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14.5" />
      <path d="M22 19.5V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14.5" />
      <path d="M2 19.5a2 2 0 0 1 2 2h12a2 2 0 0 0 2-2" />
      <path d="M8 21a2 2 0 0 1-2-2" />
    </svg>
  );
}

function UsersIcon(props) {
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
      <path d="M15 21v-6a3 3 0 0 0-6 0v6" />
      <path d="M9 13a4 4 0 1 1 6 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MoveHorizontalIcon(props) {
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
      <path d="M19 13h-2.586l-2.707-2.707a1 1 0 0 0-1.414 1.414L15.586 13H13a1 1 0 0 0 0 2h2.586l-2.707 2.707a1 1 0 0 0 1.414 1.414L19 15.414V17a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1zM5 17a1 1 0 0 0 1 1h2.586l2.707 2.707a1 1 0 0 0 1.414-1.414L8.414 18H11a1 1 0 0 0 0-2H8.414l2.707-2.707a1 1 0 0 0-1.414-1.414L6 15.586V13a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1z" />
    </svg>
  );
}