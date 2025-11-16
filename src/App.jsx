import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';

// Layout
import Layout from './layout/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Machines from './pages/Machines';
import MachineDetail from './pages/MachineDetail';
import Events from './pages/Events';
import WorkOrders from './pages/WorkOrders';

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth listener
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="machines" element={<Machines />} />
          <Route path="machines/:id" element={<MachineDetail />} />
          <Route path="events" element={<Events />} />
          <Route path="workorders" element={<WorkOrders />} />
        </Route>

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
