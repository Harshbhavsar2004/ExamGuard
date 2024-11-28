import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'react-hot-toast';
import Navbar from '../../Pages/Admin/Navbar';
import { Card } from '@/components/ui/card';
import { PlusIcon, TrashIcon } from 'lucide-react';

const AddQuestions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([
    {
      title: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      image: null,
    },
  ]);
  const [Loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [Image, setImage] = useState(null);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        title: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        image: null,
      },
    ]);
    setCurrentQuestion(questions.length);
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    if (currentQuestion >= updatedQuestions.length) {
      setCurrentQuestion(updatedQuestions.length - 1);
    }
  };

  const navigateToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const handleSaveQuestions = async () => {
    try {
      const token = localStorage.getItem('usersdatatoken');
      const questionsWithoutImage = questions.map(({ image, ...rest }) => rest);
      const payload = { questions: questionsWithoutImage };

      const response = await fetch(`/api/exams/exams/${examId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Exam questions saved successfully!');
        setTimeout(() => {
          navigate('/Users-Exams');
        }, 2000);
      } else {
        const error = await response.json();
        toast.error(`Failed to save questions: ${error.message}`);
      }
    } catch (error) {
      toast.error('Failed to save questions.');
      console.error(error);
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

  const handleImageUpload = async (e, questionIndex) => {
    const file = e.target.files[0];
    
    if (!file) {
      toast.error('No file selected.');
      return;
    }

    try {
      const token = localStorage.getItem('usersdatatoken');
      if (!token) {
        toast.error('User is not authenticated.');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`/api/exams/${examId}/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const { images } = await response.json();
        console.log(images);
        setImage(images);
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].image = images; // Save the image URL or any necessary details
        setQuestions(updatedQuestions);
        toast.success('Image uploaded successfully!');
      } else {
        const error = await response.json();
        toast.error(`Failed to upload image: ${error.message}`);
      }
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
      console.error('Error uploading image:', error);
    }
  };

  const handleDeleteImage = async (imageUrl, questionIndex) => {
    try {
      const token = localStorage.getItem('usersdatatoken');
      const response = await fetch(`/api/exams/${examId}/delete-image`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (response.ok) {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].image = null; // Remove the image from the question
        setQuestions(updatedQuestions);
        toast.success('Image deleted successfully!');
      } else {
        const error = await response.json();
        toast.error(`Failed to delete image: ${error.message}`);
      }
    } catch (error) {
      toast.error('Refresh the page and try again.');
      console.error('Error deleting image:', error);
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const correctAnswer = currentQuestionData.correctAnswer !== null ? currentQuestionData.correctAnswer.toString() : '';

  return (
    <div className="flex space-x-8 ml-64 m-2">
      {/* Left Section - Form */}
      <div className="w-1/2">
        <Navbar />
        <Toaster />

        <Card className="p-8 shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Add Questions</h1>
          <div className="space-y-4">
            <Label htmlFor={`question-${currentQuestion}-title`}>Question {currentQuestion + 1} Title</Label>
            <Input
              id={`question-${currentQuestion}-title`}
              placeholder="Enter question title"
              value={questions[currentQuestion].title}
              onChange={(e) => updateQuestion('title', e.target.value, currentQuestion)}
              className="w-full mb-4"
            />

            <div className="grid grid-cols-2 gap-4">
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index}>
                  <Label htmlFor={`question-${currentQuestion}-option-${index}`}>Option {index + 1}</Label>
                  <Input
                    id={`question-${currentQuestion}-option-${index}`}
                    placeholder={`Enter option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateQuestion('options', e.target.value, currentQuestion, index)}
                    className="mb-4"
                  />
                </div>
              ))}
            </div>

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

            <Label htmlFor="image">Upload Image (optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, currentQuestion)}
            />

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

          <div className="mt-6">
            <Button onClick={handleSaveQuestions} disabled={Loading}>
              Save Questions
            </Button>
          </div>
        </Card>
      </div>

      {/* Right Section - Preview */}
      <div className="w-1/2 p-4 border-l-2">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={index} className="p-4 shadow-md mb-4">
              <h3 className="text-lg font-bold">{question.title}</h3>
              <ul className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <li key={optionIndex}>
                    {optionIndex === question.correctAnswer ? (
                      <span className="text-green-600">{optionIndex+1}.{option}</span>
                    ) : (
                      <span>{optionIndex+1}.{option}</span>
                    )}
                  </li>
                ))}
              </ul>
              {
                Image && Image.map((image,index)=>{
                  return(
                    <div>
                      <img src={image} key={index} alt="Uploaded" className="mt-4" />
                      <Button variant="outline" color="red" onClick={() => handleDeleteImage(image, index)} className="mt-2">
                        <TrashIcon className="w-4 h-4" />
                        Delete Image
                      </Button>
                    </div>
                  )
                })
              }
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddQuestions;
