import React, { useContext, useEffect, useState } from 'react';
import StudentNavbar from './StudentNavbar';
import UserNavbar from './UserNavbar';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoginContext } from '@/components/Context/Context';

const Result = () => {
  const {logindata} = useContext(LoginContext)
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    if(!logindata){
        return
    }

    const fetchResults = async () => {
      try {
        const encodedName = encodeURIComponent(logindata.ValidUserOne.email);
        const response = await fetch(`https://examination-center.onrender.com/results?name=${(encodedName)}`);
        if (!response.ok) {
          throw new Error('Results not found');
        }
        const data = await response.json();
        console.log(data)
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
      <div className='grid grid-cols-2 -mt-40 ml-72'>
        {results.length > 0 ? (
          results.map((result, index) => (
            <Card key={index} className="w-[500px] mb-4">
              <CardHeader>
                <CardTitle>{result.exam.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
              <div className="text-4xl font-bold">
                  {/* Displaying users or any relevant information */}
                 Marks: {result.exam.Users.length > 0 ? result.exam.Users[0].score : 'No users'}
                </div>
                <p className="text-muted-foreground">
                  Thank You For Giving the test
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>{error ? `Error: ${error}` : 'No results found'}</p>
        )}
      </div>
    </div>
  );
};

export default Result;
