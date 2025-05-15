import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '@/hooks/useAuthStatus';

interface ProtectedRouteProps {
    children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loadingAuth } = useAuthStatus();

    if (loadingAuth) {
        // You can render a loading spinner or a blank page while checking auth status
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        // User not authenticated, redirect to signin page
        return <Navigate to="/signin" replace />;
    }

    // User is authenticated, render the child routes/components
    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;