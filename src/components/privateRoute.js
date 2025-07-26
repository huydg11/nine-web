import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem('authToken');
  if (!token) return <Navigate to="/admin/portal/login" replace />;

  try {
    const { exp, role } = jwtDecode(token);
    const now = Date.now() / 1000;

    if (exp < now) {
      localStorage.removeItem('authToken');
      return <Navigate to="/admin/portal/login" replace />;
    }

    if (requiredRole && role !== requiredRole) {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
  } catch {
    localStorage.removeItem('authToken');
    return <Navigate to="/admin/portal/login" replace />;
  }
}

export default PrivateRoute;
