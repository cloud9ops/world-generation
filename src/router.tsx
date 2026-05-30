// Router entry point – no direct React import needed
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import LoginPage from './components/Auth/LoginPage.tsx';
import SignupPage from './components/Auth/SignupPage.tsx';
import { useAuth } from './context/AuthContext';

const AppRouter = () => {
  const { authUser } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={authUser ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/signup" element={authUser ? <Navigate to="/" replace /> : <SignupPage />} />
        <Route path="/*" element={authUser ? <App /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
