import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { generateUserId } from "@/utils/userUtils";

type AuthView = "login" | "signup";

export default function Auth() {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  async function handleDemoLogin() {
    setLoading(true);
    setError(null);
    
    // Demo credentials - use a real-looking email that will pass validation
    const demoEmail = "demo_user@mailinator.com";
    const demoPassword = "demo123456";
    
    // Try to login with demo credentials
    const { error: loginError } = await supabase.auth.signInWithPassword({ 
      email: demoEmail, 
      password: demoPassword 
    });
    
    // If login fails (first time), create the demo account
    if (loginError) {
      console.log("Creating demo account...");
      
      // Generate a unique user_id
      const user_id = generateUserId();
      
      // Fix excessive type instantiation by simplifying the structure
      const { error: signupError } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
        options: {
          data: {
            first_name: "Demo",
            last_name: "User",
            username: "demolover",
            user_id,
          }
        }
      });
      
      if (signupError) {
        console.error("Demo signup error:", signupError);
        setError("Failed to create demo account: " + signupError.message);
        setLoading(false);
        return;
      }
      
      // Try login again after account creation
      const { error: retryError } = await supabase.auth.signInWithPassword({ 
        email: demoEmail, 
        password: demoPassword 
      });
      
      if (retryError) {
        setError("Demo login failed after account creation: " + retryError.message);
        setLoading(false);
        return;
      }
    }
    
    // Successful login
    navigate("/");
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!username) {
      setError("Username is required");
      setLoading(false);
      return;
    }

    try {
      // Use count query pattern to avoid excessive type instantiation
      const { data, error: countError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .limit(1);
      
      if (countError) {
        console.error("Error checking username:", countError);
        setError("Error checking username availability");
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setError("Username already taken");
        setLoading(false);
        return;
      }

      // Generate a unique user_id
      const user_id = generateUserId();

      // Fix excessive type instantiation by simplifying the structure
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            username,
            user_id
          }
        }
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      toast.success("Account created successfully! Please check your email for verification.");
      // Switch to login view after successful signup
      setView("login");
    } catch (e) {
      console.error("Signup error:", e);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
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
              <Input
                placeholder="Username (required)"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                minLength={5}
                maxLength={10}
                pattern="[a-zA-Z0-9]+"
                title="Username must be 5-10 alphanumeric characters"
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
        
        {/* Demo user button */}
        <div className="mt-4">
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={handleDemoLogin} 
            disabled={loading}
          >
            Sign in as Demo User
          </Button>
        </div>
        
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
