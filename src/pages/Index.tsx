
import { Navigate } from 'react-router-dom';

const Index = () => {
  // This component is no longer needed since routing is handled in App.tsx
  // Redirect to feed as the default route
  return <Navigate to="/feed" replace />;
};

export default Index;
