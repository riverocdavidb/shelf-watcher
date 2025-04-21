
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthView = "login" | "signup";
type AuthError = string | null;

export default function Auth() {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError>(null);
  const navigate = useNavigate();

  // Redirect to "/" if already authenticated
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });
  }, [navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    navigate("/");
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setView("login");
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-900 dark:to-gray-700">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {view === "login" ? "Sign In" : "Sign Up"}
        </h1>
        <form onSubmit={view === "login" ? handleLogin : handleSignup} className="space-y-4">
          {view === "signup" && (
            <>
              <Input
                autoFocus
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
              <Input
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </>
          )}
          <Input
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            autoComplete={view === "login" ? "current-password" : "new-password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && (
            <div className="text-red-500 text-xs">{error}</div>
          )}
          <Button className="w-full" disabled={loading}>
            {view === "login" ? "Sign In" : "Sign Up"}
          </Button>
        </form>
        <div className="mt-4 flex flex-col items-center gap-1">
          {view === "login" ? (
            <span>
              Don&apos;t have an account?{" "}
              <Button variant="link" size="sm" onClick={() => setView("signup")}>Sign Up</Button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <Button variant="link" size="sm" onClick={() => setView("login")}>Sign In</Button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
