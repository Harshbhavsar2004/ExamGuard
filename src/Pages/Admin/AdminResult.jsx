import { useState, useEffect, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { LoginContext } from '@/components/Context/Context';
import Navbar from './Navbar';
import { SyncLoader } from 'react-spinners';

export default function AdminExamStudent() {
    const [exams, setExams] = useState([]);
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { logindata } = useContext(LoginContext);

    // Fetch exams
    useEffect(() => {
        const fetchExams = async () => {
            if (!logindata?.ValidUserOne?.email) return;

            const email = encodeURIComponent(logindata.ValidUserOne.email);
            try {
                const response = await fetch(`https://examination-center.onrender.com/api/exams/exams?email=${email}`);
                if (!response.ok) throw new Error('Failed to fetch exams');
                const data = await response.json();
                setExams(data.exams || []);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchExams();
    }, [logindata]);

    // Fetch results for all exams when exams are loaded
    useEffect(() => {
        const fetchResultsForExams = async () => {
            try {
                const resultsMap = {};
                await Promise.all(
                    exams.map(async (exam) => {
                        const response = await fetch(`https://examination-center.onrender.com/api/results/exam/${exam._id}`);
                        if (!response.ok) throw new Error('Failed to fetch results');
                        const data = await response.json();
                        resultsMap[exam._id] = data; // Directly map the data as-is
                    })
                );
                setResults(resultsMap);
            } catch (err) {
                console.error('Error fetching results:', err);
            } finally {
                setLoading(false);
            }
        };

        if (exams.length > 0) {
            fetchResultsForExams();
        }
    }, [exams]);

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <SyncLoader />
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-600">Error: {error}</p>;
    }

    return (
        <div>
            <Navbar />
            <div className="flex flex-col ml-60 mt-16 sm:gap-4 sm:py-4 sm:pl-14">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {exams.length > 0 ? (
                        exams.map((exam) => (
                            <Card key={exam._id} className="w-full mb-4">
                                <CardHeader>
                                    <CardTitle>{exam.title}</CardTitle>
                                    <CardDescription>
                                        View the exam scores of all users who have taken the exam.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Score</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {results[exam._id]?.length > 0 ? (
                                                results[exam._id].map((result) => (
                                                    <TableRow key={result._id}>
                                                        <TableCell>
                                                            <div className="font-medium">
                                                                {result.userId.fname} {result.userId.lname}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>{result.userId.email}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>{result.score}</div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={3}>
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
