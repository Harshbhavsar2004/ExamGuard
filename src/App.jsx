import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentShow from "./Pages/Student";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import UserDash from "./Pages/User/UserDash";
import { LoginContext } from "./components/Context/Context";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import ProtectedRoute from "./components/component/ProtectedRoute";
import AddExam from "./Pages/Admin/Add-Exam";
import AddQuestions from "./components/component/Examdetails";
import UserExams from "./Pages/Admin/UserExams";
import AdminSetting from "./Pages/Admin/AdmnSetting";
import UsersExams from "./Pages/User/UsersExams";
import ExamPage from "./Pages/User/ExamPage";
import Profile from "./components/component/ConformUser";
import Result from "./Pages/User/Result";
import AdminExamstudent from "./Pages/Admin/AdminExamsstudent";
import StartExam from "./components/component/StartExam";

function App() {
  const { logindata, setLoginData } = useContext(LoginContext);
  const [data, setData] = useState(false);

  const DashboardValid = async () => {
    let token = localStorage.getItem("usersdatatoken");

    try {
      const res = await fetch("https://examination-center.onrender.com/validuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const data = await res.json();

      if (data.status === 401 || !data) {
        console.log("user not valid");
        return false;
      } else {
        console.log("user verify");
        setLoginData(data);
        console.log(data);
        return true;
      }
    } catch (error) {
      console.error("Error validating user:", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const success = await DashboardValid();
      if (!success) {
        setTimeout(fetchData, 1000); // Retry after 1 second if fetching data fails
      } else {
        setData(true);
      }
    };

    fetchData(); // Initial fetch

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setLoginData]);

  return (
    <>
      {data ? (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StudentShow />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/user-dashboard"
              element={<ProtectedRoute element={<UserDash />} />}
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute element={<AdminDashboard data={data} />} />
              }
            />
            <Route
              path="/add-exam"
              element={<ProtectedRoute element={<AddExam />} />}
            />
            <Route
              path="/exams/:examId"
              element={<ProtectedRoute element={<AddQuestions />} />}
            />
            <Route
              path="/Users-Exams"
              element={<ProtectedRoute element={<UserExams />} />}
            />
            <Route
              path="/admin-setting"
              element={<ProtectedRoute element={<AdminSetting />} />}
            />
            <Route
              path="/user-exams"
              element={<ProtectedRoute element={<UsersExams />} />}
            />
            <Route
              path="/StartExam/:id"
              element={<ProtectedRoute element={<StartExam />} />}
            />
            <Route
              path="/exam/:examId"
              element={<ProtectedRoute element={<ExamPage />} />}
            />
            <Route
              path="/Profile/:examId"
              element={<ProtectedRoute element={<Profile />} />}
            />
            <Route
              path="/results"
              element={<ProtectedRoute element={<Result />} />}
            />
            <Route
              path="/adminExamsDetails"
              element={<ProtectedRoute element={<AdminExamstudent />} />}
            />
          </Routes>
        </BrowserRouter>
      ) : (
        <div className="flex justify-center items-center w-full h-screen text-2xl">
          Loading...
        </div>
      )}
    </>
  );
}

export default App;
