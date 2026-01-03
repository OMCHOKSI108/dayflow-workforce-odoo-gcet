import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Tasks from './pages/Tasks';
import Chatbot from './components/Chatbot';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
      <Chatbot />
    </div>
  );
};


const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/dashboard" />;
  return (
    <>
      {children}
      <Chatbot />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
          <Route path="/employees/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
          <Route path="/leaves" element={<ProtectedRoute><Leaves /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/payroll" element={<ProtectedRoute><div className="card"><h1>Payroll</h1><p>Coming Soon...</p></div></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
