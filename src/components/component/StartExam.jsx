import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
export default function StartExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await fetch(`/api/exams/exams/${id}`);
        if (!response.ok) {
          throw new Error("Exam not found");
        }
        const data = await response.json();

        if (!data.date || !data.startTime) {
          throw new Error("Invalid date or time data.");
        }
        setExam(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExamData();
    }
  }, [id]);

  useEffect(() => {
    const updateRemainingTime = () => {
      if (exam) {
        const examDateTime = new Date(`${formatDate(exam.date)}T${exam.startTime}`);
        const now = new Date();
        const timeDiff = examDateTime - now;

        if (timeDiff > 0) {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

          setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
          setIsButtonDisabled(timeDiff > 0);
        } else {
          setRemainingTime("Exam started!");
          setIsButtonDisabled(false);
        }
      }
    };

    updateRemainingTime();
    const intervalId = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [exam]);

  const handleButtonClick = () => {
    navigate(`/exam/${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="w-full h-screen flex justify-center items-center"><SyncLoader /></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">Error: {error}</div>;
  }

  return (
    <div>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary">
        <div className="container px-4 md:px-6 text-center text-primary-foreground">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">{exam.title}</h1>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
              Don't miss your chance to take the exam and unlock new opportunities. Sign up today and secure your spot.
            </p>
            <div className="text-lg font-semibold mt-4">
              {remainingTime || 'Calculating remaining time...'}
            </div>
            <Button
            variant="secondary"
              disabled={isButtonDisabled}
              onClick={handleButtonClick}
            >
              Start Exam
            </Button>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-2">
              <h2 className="text-2xl font-bold">Exam Details</h2>
              <p>Creator: {exam.Creater}</p>
              <p>Questions: {exam.questions.length}</p>
              <p className="text-muted-foreground">Get all the information you need about the upcoming exam.</p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-1">
                <h3 className="text-lg font-semibold">Date</h3>
                <p>{exam ? formatDate(exam.date) : 'Loading...'}</p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-semibold">Time</h3>
                <p>{exam ? `${exam.startTime} - ${exam.endTime}` : 'Loading...'}</p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-semibold">Duration</h3>
                <p>{exam ? `${calculateDuration(exam.startTime, exam.endTime)} hours` : 'Loading...'}</p>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-1">
                <h3 className="text-lg font-semibold">Location</h3>
                <p>Online</p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-semibold">Format</h3>
                <p>MCQ Base</p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-semibold">Fee</h3>
                <p>Free of Cost</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Utility function to calculate duration in hours
function calculateDuration(startTime, endTime) {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const duration = new Date(end - start);
  return duration.getUTCHours() + (duration.getUTCMinutes() / 60);
}
