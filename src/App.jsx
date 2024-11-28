// src/AppRoutes.js
import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useTheme } from "./components/Context/ThemeProvider";
import StudentShow from "./Pages/Student";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import UserDash from "./Pages/User/Userdashboard";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import ProtectedRoute from "./components/component/ProtectedRoute";
import AddExam from "./Pages/Admin/Add-Exam";
import AddQuestions from "./components/component/Examdetails";
import UserExams from "./Pages/Admin/UserExams";
import AdminSetting from "./Pages/Admin/AdmnSetting";
import UsersExams from "./Pages/User/UsersExams";
import ExamPage from "./Pages/User/ExamPage";
import Profile from "./components/component/ConformUser";
import UserResult from "./Pages/User/UserResult";
import AdminExamstudent from "./Pages/Admin/AdminResult";
import StartExam from "./components/component/StartExam";
import { BarLoader } from "react-spinners";
import { LoginContext } from "./components/Context/Context";
import AdminResult from "./Pages/Admin/AdminResult";

const AppRoutes = () => {
  const { setLoginData } = useContext(LoginContext)
  const [data, setData] = useState(false);
  const { theme } = useTheme();
  const history = useNavigate();

  const DashboardValid = async () => {
    let token = localStorage.getItem("usersdatatoken");

    if (!token) {
      history("/");
    }
    const res = await fetch("/api/users/validuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("usersdatatoken")}`,
      },
    });

    const data = await res.json();

    if (data.status === 401 || !data) {
      console.log("user not valid");
    } else {
      console.log("user verify");
      setLoginData(data);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      DashboardValid();
      setData(true);
    }, 1500);
  }, []);



  return (
    <div>
      {data ? (
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
            element={<ProtectedRoute element={<AdminDashboard />} />}
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
            path="/user-result"
            element={<ProtectedRoute element={<UserResult />} />}
          />
          <Route
            path="/admin-result"
            element={<ProtectedRoute element={<AdminResult />} />}
          />
        </Routes>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <BarLoader
            color={theme == "dark" ? "#fff" : "#000"}
            width={300}
          />
        </div>
      )}
    </div>
  );
};

export default AppRoutes;
