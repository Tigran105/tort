import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import CakesPage from './pages/CakesPage';
import CategoriesPage from './pages/CategoriesPage';
import ComponentsPage from './pages/ComponentsPage';
import OrdersPage from './pages/OrdersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="cakes" element={<CakesPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="components" element={<ComponentsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
