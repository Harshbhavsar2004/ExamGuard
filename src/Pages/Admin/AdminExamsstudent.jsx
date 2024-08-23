import { useState, useEffect, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { LoginContext } from '@/components/Context/Context';
import Navbar from './Navbar';
import { SyncLoader } from 'react-spinners';
export default function AdminExamstudent() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { logindata } = useContext(LoginContext);

    useEffect(() => {
        const fetchExams = async () => {
            if (!logindata || !logindata.ValidUserOne || !logindata.ValidUserOne.email) {
                return;
            }

            const user = logindata.ValidUserOne.email;
            const encodedName = encodeURIComponent(user);

            try {
                const response = await fetch(`https://examination-center.onrender.com/exams?email=${encodedName}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setExams(data.exams || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, [logindata]);

    if (loading) return <div className="w-full h-screen flex justify-center items-center"><SyncLoader /></div>;
    if (error) return <p>Error: {error}</p>;

    return (
      <div>
        <Navbar/>
        <div className="flex flex-col ml-60 mt-16 sm:gap-4 sm:py-4 sm:pl-14">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                {exams.length > 0 ? (
                    exams.map((exam) => (
                        <Card key={exam._id} className="w-full mb-4">
                            <CardHeader>
                                <CardTitle>{exam.title}</CardTitle>
                                <CardDescription>View the exam scores of all users who have taken the exam.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Score</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {exam.Users.length > 0 ? (
                                            exam.Users.map((user) => (
                                                <TableRow key={user._id}>
                                                    <TableCell>
                                                        <div className="font-medium">{user.name}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>{user.score}</div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={2}>
                                                    <div className="text-center">No user data available</div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center">No exams available</div>
                )}
            </main>
        </div>
      </div>
    );
}
