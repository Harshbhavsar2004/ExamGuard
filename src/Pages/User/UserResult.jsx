import React, { useContext, useEffect, useState } from 'react';
import StudentNavbar from './StudentNavbar';
import UserNavbar from './UserNavbar';
import { LoginContext } from '@/components/Context/Context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Hash, User } from 'lucide-react';

const UserResult = () => {
  const { logindata } = useContext(LoginContext);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!logindata) {
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/results/results/${logindata.ValidUserOne._id}`);
        if (!response.ok) {
          throw new Error('Results not found');
        }
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (logindata?.ValidUserOne?.email) {
      fetchResults();
    }
  }, [logindata]);

  if (error) {
    return (
      <div>
        <StudentNavbar />
        <UserNavbar />
        <div className="text-red-500 text-center mt-4">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <StudentNavbar />
      <UserNavbar />

      <div className="-mt-40 ml-64">
        <h1 className="text-3xl font-bold mb-6 text-center">Exam Results</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.length > 0 ? (
            results.map((result, index) => (
              <Card key={index} className="w-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="text-xl font-semibold text-primary">
                    Result {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      <h2 className="text-2xl font-bold">Score: {result.score}</h2>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Hash className="w-5 h-5 text-blue-500" />
                      <p className="text-sm">Exam ID: {result.examId}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-green-500" />
                      <p className="text-sm">User ID: {result.userId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-500">
              No results available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserResult;
