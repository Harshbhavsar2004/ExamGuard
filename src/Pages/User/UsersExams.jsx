import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'; // Replace with actual import
import { Button } from '@/components/ui/button';
import StudentNavbar from './StudentNavbar';
import UserNavbar from './UserNavbar';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ExamsList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch('https://examination-center.onrender.com/exams/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setExams(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleViewExam = (exam) => {
    // Redirect to the exam page
    navigate(`/StartExam/${exam._id}`);
  };

  const handleShare = async (exam) => {
    const examUrl = `${window.location.origin}/exam/${exam._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: exam.title,
          text: `Check out this exam: ${exam.title}`,
          url: examUrl,
        });
        console.log('Exam shared successfully');
      } catch (error) {
        console.error('Error sharing the exam:', error);
      }
    } else {
      // Fallback to copy link to clipboard
      try {
        await navigator.clipboard.writeText(examUrl);
        alert('Exam link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy exam link:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
    <div className="flex flex-col min-h-screen">
      <StudentNavbar />
      <UserNavbar />
      <div className="flex-1 overflow-auto ml-60 -mt-48"> {/* Adjust padding and ensure overflow */}
        <div className="grid grid-cols-2 gap-4">
          {exams.map((exam) => (
            <Card key={exam._id} className="m-4">
              <CardHeader>
                <CardTitle>{exam.title}</CardTitle>
                <CardDescription>Creator: {exam.Creater}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 items-center gap-2">
                  <div className="text-muted-foreground">Date:</div>
                  <div>{new Date(exam.date).toLocaleDateString()}</div>
                </div>
                <div className="grid grid-cols-2 items-center gap-2">
                  <div className="text-muted-foreground">Time:</div>
                  <div>{`${exam.startTime} - ${exam.endTime}`}</div>
                </div>
                <div className="grid grid-cols-2 items-center gap-2">
                  <div className="text-muted-foreground">Duration:</div>
                  <div>{`${calculateDuration(exam.startTime, exam.endTime)} minutes`}</div>
                </div>
                <Separator />
                <div className="text-center text-muted-foreground">
                  Good luck on your exam!
                </div>
                <Button size="lg" onClick={() => handleViewExam(exam)}>Enroll</Button>
                <Button size="lg" variant="outline" onClick={() => handleShare(exam)}>Share</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamsList;
