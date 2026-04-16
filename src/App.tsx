import type React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import { CheckInPage } from "./pages/CheckInPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";

function ProtectedRoute(props: React.PropsWithChildren) {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (!session) return <Navigate to="/login" replace />;

  return props.children;
}

function AppRoutes() {
  const { session, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route
        path="/login"
        element={session ? <Navigate to="/check-in" replace /> : <LoginPage />}
      />
      <Route
        path="/home"
        element={session ? <Navigate to="/check-in" replace /> : <HomePage />}
      />
      <Route
        path="/check-in"
        element={
          <ProtectedRoute>
            <CheckInPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate to={session ? "/check-in" : "/home"} replace />}
      />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
