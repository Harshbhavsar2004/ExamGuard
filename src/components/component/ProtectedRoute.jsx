import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
function ProtectedRoute({ element }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem("usersdatatoken");
      if (token) {
        // Here you might also want to verify the token with an API if needed
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    // While checking authentication, you can show a loading spinner or message
    return <div className="w-full h-full flex justify-center items-center"><SyncLoader /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return element;
}

export default ProtectedRoute;
