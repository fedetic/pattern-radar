import { Suspense, useEffect, useState } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SignupLoginPage from "./components/SignupLoginPage";
import Home from "./components/home";
import { supabase } from "./lib/supabase";
import routes from "tempo-routes";

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/auth"
            element={
              session ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <SignupLoginPage />
              )
            }
          />
          <Route path="/dashboard" element={<Home />} />
        </Routes>
        {/* {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)} */}
      </>
    </Suspense>
  );
}

export default App;
