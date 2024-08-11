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

function App() {
  const { logindata, setLoginData } = useContext(LoginContext);
  const [data, setData] = useState(false);

  const DashboardValid = async () => {
    let token = localStorage.getItem("usersdatatoken");

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
    } else {
      console.log("user verify");
      setLoginData(data);
      console.log(data);
    }
  };

  useEffect(() => {
    DashboardValid();
    setData(true);
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
        <div className="flex justify-center items-center ali w-dvh h-dvh m-3 text-2xl">
          Loading..
        </div>
      )}
    </>
  );
}

export default App;
