import { useContext, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/component/Navbar';
import { LoginContext } from '@/components/Context/Context';

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('usersdatatoken'); // Retrieve the token from localStorage
  const { logindata } = useContext(LoginContext);

  useEffect(() => {
    async function fetchExams() {
      try {
        if (!logindata || !logindata.ValidUserOne) {
          console.error('No user email available');
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
        setExams(data.exams);
      } catch (error) {
        console.error('Error fetching exam details:', error);
      }
    }
  
    fetchExams();
  }, [token, logindata]);

  // Function to handle view exam button click
  function handleViewExam(exam) {
    setSelectedExam(exam);
  }

  // Function to handle back to list
  function handleBackToList() {
    setSelectedExam(null);
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
      setExams(prevExams => prevExams.filter(exam => exam.title !== title));
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };

  if (selectedExam) {
    return (
      <div className="flex">
        <Navbar className="flex-none w-64" />
        <div className="ml-60 main-content flex-1 flex justify-center items-start p-4">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>{selectedExam.title}</CardTitle>
              <CardDescription>Exam Details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 items-center gap-4">
                <div className="text-muted-foreground">Exam Name</div>
                <div className="font-medium">{selectedExam.title}</div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <div className="text-muted-foreground">Created On</div>
                <div className="font-medium">{new Date(selectedExam.date).toLocaleDateString()}</div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <div className="text-muted-foreground">Start Time</div>
                <div className="font-medium">{selectedExam.startTime}</div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <div className="text-muted-foreground">End Time</div>
                <div className="font-medium">{selectedExam.endTime}</div>
              </div>
              <div className="mt-6">
                <h2 className="text-lg font-semibold">Questions</h2>
                {selectedExam.questions.map((question, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-medium">Q{index + 1}: {question.title}</h3>
                    {question.options && (
                      <ul className="list-disc pl-5">
                        {question.options.map((option, i) => (
                          <li
                            key={i}
                            className={`text-muted-foreground ${i == question.correctAnswer ? 'font-bold text-green-600' : ''}`}
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleBackToList}>Back to List</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className='flex items-center justify-center'>
        <Navbar />
        <p>No exams found.</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <Navbar className="flex-none w-64" />
      <div className="ml-60 main-content flex-1 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {exams.map(exam => (
            <Card key={exam._id} className="w-full max-w-xl mx-auto">
              <CardHeader>
                <CardTitle>{exam.title}</CardTitle>
                <CardDescription>View details of the exams you have created.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-2 items-center gap-4">
                  <div className="text-muted-foreground">Exam Name</div>
                  <div className="font-medium">{exam.title}</div>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <div className="text-muted-foreground">Created On</div>
                  <div className="font-medium">{new Date(exam.date).toLocaleDateString()}</div>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <div className="text-muted-foreground">Start Time</div>
                  <div className="font-medium">{exam.startTime}</div>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <div className="text-muted-foreground">End Time</div>
                  <div className="font-medium">{exam.endTime}</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button onClick={() => handleViewExam(exam)}>View Exam</Button>
                <Button variant="ghost" onClick={() => handleDeleteExam(exam.title)}>Delete Exam</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
