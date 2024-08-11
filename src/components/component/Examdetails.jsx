import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'react-hot-toast';
import Navbar from './Navbar';

const AddQuestions = () => {
  const { examId } = useParams();
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([
    {
      title: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: 0,
    },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        title: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ]);
    setCurrentQuestion(questions.length);
  };

  const updateQuestion = (field, value, index, optionIndex = null) => {
    const updatedQuestions = [...questions];
    if (field === 'options' && optionIndex !== null) {
      updatedQuestions[index][field][optionIndex] = value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const navigateToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const handleSaveQuestions = async () => {
    try {
      const token = localStorage.getItem('usersdatatoken');
      const response = await fetch(`https://examination-center.onrender.com/exams/${examId}`, {
        method: 'PUT', // Use PUT for updating
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ questions }),
      });

      if (response.ok) {
        toast.success('Exam Created Succefully!');
        setTimeout(()=>{
            navigate('/Users-Exams')
        })
      } else {
        const error = await response.json();
        toast.error(`Failed to add questions: ${error.message}`);
      }
    } catch (error) {
      toast.error('Failed to add questions.');
      console.error(error);
    }
  };

  return (
    <div className="flex">
      {/* Navbar */}
      <div className="">
        <Navbar />
        <Toaster />
      </div>

      {/* Main Content */}
      <div className="ml-60 main-content flex-1 p-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Add Questions</h1>
          <div className="space-y-4">
            <div>
              <Label htmlFor={`question-${currentQuestion}-title`}>Question {currentQuestion + 1} Title</Label>
              <Input
                id={`question-${currentQuestion}-title`}
                placeholder="Enter question title"
                value={questions[currentQuestion].title}
                onChange={(e) => updateQuestion('title', e.target.value, currentQuestion)}
                className="w-full mb-4"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index}>
                  <Label htmlFor={`question-${currentQuestion}-option-${index}`}>Option {index + 1}</Label>
                  <Input
                    id={`question-${currentQuestion}-option-${index}`}
                    placeholder={`Enter option ${index + 1}`}
                    value={option}
                    onChange={(e) =>
                      updateQuestion('options', e.target.value, currentQuestion, index)
                    }
                    className="mb-4"
                  />
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor={`question-${currentQuestion}-correct-answer`}>Correct Answer</Label>
              <Select
                id={`question-${currentQuestion}-correct-answer`}
                value={questions[currentQuestion].correctAnswer}
                onValueChange={(value) => updateQuestion('correctAnswer', parseInt(value), currentQuestion)}
                className="w-full mb-4"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select correct answer" />
                </SelectTrigger>
                <SelectContent>
                  {questions[currentQuestion].options.map((_, index) => (
                    <SelectItem key={index} value={index}>
                      Option {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between items-center">
              {currentQuestion > 0 && (
                <Button variant="outline" onClick={() => navigateToQuestion(currentQuestion - 1)}>
                  Previous
                </Button>
              )}
              {currentQuestion < questions.length - 1 && (
                <Button onClick={() => navigateToQuestion(currentQuestion + 1)}>Next</Button>
              )}
              <Button onClick={addQuestion} variant="outline" className="flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                Add Question
              </Button>
              {currentQuestion === questions.length - 1 && (
                <Button onClick={handleSaveQuestions}>Save Questions</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function PlusIcon(props) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

export default AddQuestions;
