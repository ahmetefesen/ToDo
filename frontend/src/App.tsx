import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TaskListPage from './pages/TaskListPage';
import TaskDetailPage from './pages/TaskDetailPage';
import TaskEditPage from './pages/TaskEditPage';
import TeamListPage from './pages/TeamListPage';
import CommentListPage from './pages/CommentListPage';
import './App.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Navigate to="/tasks" />} />
          
          {/* Protected Routes */}
          <Route path="/tasks" element={
            <ProtectedRoute>
              <TaskListPage />
            </ProtectedRoute>
          } />
          <Route path="/tasks/:id" element={
            <ProtectedRoute>
              <TaskDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/tasks/:id/edit" element={
            <ProtectedRoute>
              <TaskEditPage />
            </ProtectedRoute>
          } />
          <Route path="/teams" element={
            <ProtectedRoute>
              <TeamListPage />
            </ProtectedRoute>
          } />
          <Route path="/comments" element={
            <ProtectedRoute>
              <CommentListPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
