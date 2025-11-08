import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/app/DashboardPage';
import EntriesPage from './pages/app/EntriesPage';
import ProductsPage from './pages/app/ProductsPage';
import ChatPage from './pages/app/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/sign-in" replace />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/app" element={<AppLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="entries" element={<EntriesPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
