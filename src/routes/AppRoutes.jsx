import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import StudentDashboard from "../pages/StudentDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ChatbotPage from "../pages/ChatbotPage";
import ProtectedRoute from "./ProtectedRoute";
import Checkout from "../pages/Checkout";
import News from "../pages/News";
import Store from "../pages/Store";
import Contact from "../pages/Contact";
import About from "../pages/About";
import Schedule from "../pages/Schedule";
import JobApplication from "../pages/JobApplication";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/aluno"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/chatbot" element={<ChatbotPage />} />
      <Route path="/contratacao" element={<Checkout />} />
      <Route path="/noticias" element={<News />} />
      <Route path="/produtos" element={<Store />} />
      <Route path="/contato" element={<Contact />} />
      <Route path="/sobre" element={<About />} />
      <Route path="/agenda" element={<Schedule />} />
      <Route path="/trabalhe-conosco" element={<JobApplication />} />
    </Routes>
  );
}