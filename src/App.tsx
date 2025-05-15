
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Playlists from "./pages/Playlists";
import PlaylistDetails from "./pages/PlaylistDetails";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute"; // Added import

const queryClient = new QueryClient();

const App = () => {
  const { user, loadingAuth } = useAuthStatus();

  if (loadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading authentication status...</p>
      </div>
    );
  }

  // Example: Basic protected routing or conditional UI based on user
  // You can expand this logic to protect specific routes or show different UI
  // if (!user) {
  //   // If not logged in and trying to access a protected route, redirect to SignIn
  //   // This is a simplified example. For more complex scenarios, consider a dedicated PrivateRoute component.
  //   // For now, we'll just show a message if trying to access root without being logged in.
  //   // You might want to allow access to SignIn/SignUp regardless of auth state.
  // }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index user={user} />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/playlists/:id" element={<PlaylistDetails />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
