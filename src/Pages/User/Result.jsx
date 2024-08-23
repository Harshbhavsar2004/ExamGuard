import React, { useContext, useEffect, useState } from 'react';
import StudentNavbar from './StudentNavbar';
import UserNavbar from './UserNavbar';
import { LoginContext } from '@/components/Context/Context';

const Result = () => {
  const { logindata } = useContext(LoginContext);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!logindata) {
      return;
    }

    const fetchResults = async () => {
      try {
        const encodedName = encodeURIComponent(logindata.ValidUserOne.email);
        const response = await fetch(`https://examination-center.onrender.com/results?name=${encodedName}`);
        if (!response.ok) {
          throw new Error('Results not found');
        }
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (logindata.ValidUserOne.email) {
      fetchResults();
    }
  }, [logindata]);

  return (
    <div>
      <StudentNavbar />
      <UserNavbar />


      <div className="grid grid-cols-2 -mt-40 ml-64">
        {results.length > 0 ? (
          results.map((result, examIndex) => (
            <div key={examIndex} className="bg-background rounded-lg border p-6 w-full max-w-2xl mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{result.exam.title}</h2>
                <div className="bg-muted rounded-full px-3 py-1 text-sm text-muted-foreground">
                  {result.exam.Creater}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {result.exam.Users.slice().reverse().map((user, userIndex) => (
                  <div key={userIndex} className={`bg-card rounded-lg p-4 border ${userIndex === 0 ? "ring-2 ring-primary" : ""}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-muted-foreground">Attempt {result.exam.Users.length - userIndex}</div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          userIndex === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {userIndex === 0 ? "Latest" : "Previous"}
                      </div>
                    </div>
                    <div className="text-3xl font-bold">{user.score}</div>
                   
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-10">{error ? `Error: ${error}` : 'No results found'}</p>
        )}
      </div>
    </div>
  );
};

export default Result;
