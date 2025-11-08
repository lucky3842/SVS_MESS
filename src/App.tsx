import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/app/DashboardPage';
import EntriesPage from './pages/app/EntriesPage';
import ProductsPage from './pages/app/ProductsPage';
import ChatPage from './pages/app/ChatPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="entries" element={<EntriesPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="chat" element={<ChatPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
