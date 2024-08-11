import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Profile from '@/components/component/ConformUser';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import FaceDetection from '@/components/component/FaceDetection';
import { LoginContext } from '@/components/Context/Context';

const ExamPage = () => {
    const { examId } = useParams();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userVerified, setUserVerified] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const {logindata} = useContext(LoginContext);
    const [run, setRun] = useState(true);
    useEffect(() => {
        const fetchExam = async () => {
            try {
                const response = await fetch(`https://examination-center.onrender.com/exams/${examId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setExam(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [examId]);

    const handleVerificationStatus = (status) => {
        setUserVerified(status);
    };

    const handleAnswerChange = (selectedOptionIndex) => {
        const updatedAnswers = [...selectedAnswers];
        updatedAnswers[currentQuestionIndex] = selectedOptionIndex;
        setSelectedAnswers(updatedAnswers);
    };

    const handlePrevious = () => {
        setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleNext = () => {
        setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, exam.questions.length - 1));
    };

    const handleSubmitAndClose = async () => {
        setSubmitting(true); // Set loading to true when the submit process starts
    
        let score = 0;
    
        exam.questions.forEach((question, index) => {
            if (selectedAnswers[index] !== undefined && question.options[question.correctAnswer] === question.options[selectedAnswers[index]]) {
                score++;
            }
        });
    
        const token = localStorage.getItem('usersdatatoken'); 
    
        try {
            // Add user data to the exam
            const addUserResponse = await fetch(`https://examination-center.onrender.com/exams/${examId}/add-user`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: logindata.ValidUserOne.email , score: score }) // Replace 'Your Name' with the actual user's name
            });
    
            if (!addUserResponse.ok) {
                throw new Error('Failed to add user data');
            }
    
            const addUserData = await addUserResponse.json();
            console.log('User data added:', addUserData);
    
            // Submit the exam
            const submitResponse = await fetch(`https://examination-center.onrender.com/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ submit: true })
            });
    
            if (submitResponse.ok) {
                console.log('Exam submitted successfully');
                navigate('/user-dashboard'); // Navigate to the dashboard after successful submission
            } else {
                throw new Error('Error submitting the exam');
            }
        } catch (error) {
            console.error('Error during submission:', error);
        } finally {
            setSubmitting(false); // Reset loading state once the process is done
        }
    };
    
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="layout-container">
            <div className="questions-section">
                {userVerified ? (
                    <div className="h-screen">
                        <h1 className="text-3xl m-10 font-bold">{exam.title}</h1>
                        <Card className="w-11/12 p-10 mx-auto">
                            <CardContent>
                                <div className="flex">
                                    <div className="flex-1 mr-6">
                                        {exam && exam.questions && exam.questions.length > 0 && (
                                            <Card className="w-full">
                                                <CardHeader>
                                                    <CardTitle>{exam.questions[currentQuestionIndex].title}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-4">
                                                        <p>Select the correct answer from the options below:</p>
                                                        <RadioGroup
                                                            aria-label={`answer-options-${currentQuestionIndex}`}
                                                            className="grid gap-2"
                                                            value={selectedAnswers[currentQuestionIndex] ?? ''}
                                                            onValueChange={handleAnswerChange}
                                                        >
                                                            {exam.questions[currentQuestionIndex].options.map((option, optIndex) => (
                                                                <Label
                                                                    key={optIndex}
                                                                    htmlFor={`option${optIndex}`}
                                                                    className="flex items-center gap-2 rounded-md border border-input bg-background p-3 transition-colors hover:bg-muted"
                                                                >
                                                                    <RadioGroupItem
                                                                        id={`option${optIndex}`}
                                                                        value={optIndex}
                                                                        checked={selectedAnswers[currentQuestionIndex] === optIndex}
                                                                    />
                                                                    {option}
                                                                </Label>
                                                            ))}
                                                        </RadioGroup>
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="flex justify-between">
                                                    <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                                                        Previous
                                                    </Button>
                                                    <Button onClick={handleNext} disabled={currentQuestionIndex === exam.questions.length - 1}>
                                                        Next
                                                    </Button>
                                                </CardFooter>
                                                <CardFooter className="flex justify-end">
                                                    <Button onClick={handleSubmitAndClose} disabled={submitting}>
                                                        {submitting ? 'Submitting...' : 'Submit'}
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        )}
                                    </div>
                                    <div className="w-1/3">
                                    <FaceDetection run={run} setRun={setRun} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <Profile onVerification={handleVerificationStatus} />
                )}
            </div>
        </div>
    );
};

export default ExamPage;
