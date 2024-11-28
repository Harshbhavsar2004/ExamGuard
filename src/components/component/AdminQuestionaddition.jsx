import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'react-hot-toast';
import Navbar from '../../Pages/Admin/Navbar';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Card } from '@/components/ui/card';
import { PlusIcon } from 'lucide-react';
const genAI = new GoogleGenerativeAI("AIzaSyAVQFc-U4OBlAC7LVw7OMbedlCHnpx0uwk");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const AddQuestions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([{
    title: '',
    options: ['', '', '', ''],
    correctAnswer: 0, // Set default value here
  }]);
  const [Loading, setLoading] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [numQuestions, setNumQuestions] = useState(5); // New state for number of questions
  const [image, setImage] = useState(null); // State to store the uploaded image

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        title: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ]);
    setCurrentQuestion(questions.length);
  };

  const navigateToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const handleSaveQuestions = async () => {
    try {
      const token = localStorage.getItem('usersdatatoken');
      const response = await fetch(`https://examination-center.onrender.com/api/exams/exams/${examId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ questions, image }), // Send the image as well
      });

      if (response.ok) {
        toast.success('Exam Created Successfully!');
        setTimeout(() => {
          navigate('/Users-Exams');
        }, 2000);
      } else {
        const error = await response.json();
        toast.error(`Failed to add questions: ${error.message}`);
      }
    } catch (error) {
      toast.error('Failed to add questions.');
      console.error(error);
    }
  };

  const handleGenerateQuestions = async () => {
    setLoading(true);
    try {
      const fullPrompt = `Generate ${numQuestions} questions on the following topic, each with 4 options and indicate the correct option index. Provide the response in JSON format, give only array no other things:
      Topic: ${prompt}
      The output should be a JSON array where each object has the following fields:
      - title: The question title
      - options: An array of 4 options
      - correctAnswer: The index of the correct answer (0-based)
      Example JSON format:
      [
        {
          "title": "Question Title 1",
          "options": [
            "Option 1",
            "Option 2",
            "Option 3",
            "Option 4"
          ],
          "correctAnswer": 0
        }
        // Add more questions as needed
      ]`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = await response.text();

      let newQuestions = [];
      try {
        newQuestions = JSON.parse(text.trim());
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        toast.error('Failed to parse the generated questions.');
        return;
      }

      if (Array.isArray(newQuestions)) {
        newQuestions.forEach(question => {
          if (
            typeof question.title === 'string' &&
            Array.isArray(question.options) &&
            question.options.length === 4 &&
            typeof question.correctAnswer === 'number' &&
            question.correctAnswer >= 0 && question.correctAnswer < 4 // Ensure valid index
          ) {
            question.options = question.options.map(opt => opt.trim()); // Clean up options
          } else {
            console.error('Invalid question format:', question);
          }
        });
        setQuestions(newQuestions);
        setCurrentQuestion(0);
        setLoading(false);
        toast.success('Questions generated successfully!');
      } else {
        toast.error('The format of the generated questions is incorrect.');
      }
    } catch (error) {
      toast.error('Failed to generate questions.');
      console.error('Error in handleGenerateQuestions:', error);
    }
  };

  const updateQuestion = (field, value, questionIndex, optionIndex = null) => {
    const updatedQuestions = [...questions];
    if (field === 'title') {
      updatedQuestions[questionIndex].title = value;
    } else if (field === 'options') {
      updatedQuestions[questionIndex].options[optionIndex] = value;
    } else if (field === 'correctAnswer') {
      updatedQuestions[questionIndex].correctAnswer = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Save image to state
      };
      reader.readAsDataURL(file); // Convert file to base64 string
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const correctAnswer = currentQuestionData.correctAnswer !== null ? currentQuestionData.correctAnswer.toString() : '';

  return (
    <div className="flex flex-col space-y-8">
      {/* Navbar */}
      <div>
        <Navbar />
        <Toaster />
      </div>

      {/* Main Content */}
      <Card className="ml-72 mr-10 main-content flex-1 p-8 shadow-lg rounded-lg ">
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
            <Select
              id={`question-${currentQuestion}-correct-answer`}
              value={correctAnswer}
              onValueChange={(value) => updateQuestion('correctAnswer', parseInt(value), currentQuestion)}
              className="w-full mb-4"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select correct answer" />
              </SelectTrigger>
              <SelectContent>
                {currentQuestionData.options.map((_, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    Option {index + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Upload Image Button */}
          <div className="flex items-center gap-2">
            <Button variant="outline" component="label">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <span>Upload Image</span>
            </Button>
            {image && <img src={image} alt="Uploaded" className="w-24 h-24 object-cover rounded-md" />}
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
          </div>
        </div>

        {/* Save and Generate Buttons */}
        <div className="mt-6 flex justify-between">
          <Button onClick={handleSaveQuestions} disabled={Loading}>Save Questions</Button>
          <Button onClick={handleGenerateQuestions} disabled={Loading}>Generate Questions</Button>
        </div>
      </Card>
    </div>
  );
};

export default AddQuestions;
