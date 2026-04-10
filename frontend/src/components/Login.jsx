import { useEffect, useState } from "react";

function Login({ setPlayerId, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({
    identifier: "",
    password: ""
  });

  const [signupForm, setSignupForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    setMode(initialMode === "signup" ? "signup" : "login");
    setError("");
  }, [initialMode]);

  const handleGuest = () => {
    const fallback = `guest_${Math.random().toString(36).slice(2, 8)}`;
    const id = (loginForm.identifier || "").trim().toLowerCase() || fallback;
    setPlayerId(id);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const username = loginForm.identifier.trim().toLowerCase();
    if (!username || !loginForm.password.trim()) {
      setError("Enter username and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/game/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password: loginForm.password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      setPlayerId(username);
    } catch {
      setError("Network error while login.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const username = signupForm.username.trim().toLowerCase();
    if (!username || !signupForm.password.trim()) {
      setError("Username and password are required.");
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/game/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password: signupForm.password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      setMode("login");
      setLoginForm((p) => ({ ...p, identifier: username, password: "" }));
      setError("Account created. Please login.");
    } catch {
      setError("Network error while signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex items-center justify-center p-6 map-bg relative overflow-hidden">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-surface-tint opacity-[0.03] blur-[120px] pointer-events-none" />

      <main className="w-full max-w-lg z-10">
        <div className="glass-card rounded-xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />

          <div className="text-center mb-8 relative z-10">
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary drop-shadow-[0_0_12px_rgba(164,255,185,0.3)] uppercase">
              GeoClash
            </h1>
            <p className="text-on-surface-variant font-label text-sm mt-2 tracking-widest uppercase">
              Global Territory Conquest
            </p>
          </div>

          <div className="mb-6 flex rounded-lg overflow-hidden border border-outline-variant/30">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-headline ${mode === "login" ? "bg-primary/20 text-primary" : "bg-transparent text-on-surface-variant"}`}
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              Login
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-headline ${mode === "signup" ? "bg-primary/20 text-primary" : "bg-transparent text-on-surface-variant"}`}
              onClick={() => {
                setMode("signup");
                setError("");
              }}
            >
              Sign Up
            </button>
          </div>

          {mode === "login" ? (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2 group">
                <label className="block text-sm font-label font-medium text-on-surface-variant" htmlFor="identifier">Username</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">alternate_email</span>
                  <input
                    id="identifier"
                    className="w-full bg-surface-container-highest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary transition-all duration-300 outline-none"
                    placeholder="Enter your username"
                    type="text"
                    value={loginForm.identifier}
                    onChange={(e) => setLoginForm((p) => ({ ...p, identifier: e.target.value }))}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="block text-sm font-label font-medium text-on-surface-variant" htmlFor="password">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">lock</span>
                  <input
                    id="password"
                    className="w-full bg-surface-container-highest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary transition-all duration-300 outline-none"
                    placeholder="••••••••"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                  />
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-headline font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 kinetic-glow group disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? "Logging In..." : "Login"}</span>
                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">login</span>
              </button>

              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-[1px] bg-outline-variant/20" />
                <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50">or access as</span>
                <div className="flex-1 h-[1px] bg-outline-variant/20" />
              </div>

              <button
                className="w-full bg-surface-bright/40 border border-outline-variant/20 text-on-surface font-label font-semibold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-bright/60 hover:border-primary/30 transition-all duration-300 group"
                type="button"
                onClick={handleGuest}
              >
                <span className="material-symbols-outlined text-xl group-hover:text-primary transition-colors">person_search</span>
                <span>Guest Entry</span>
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleSignup}>
              <div className="group">
                <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="fullname">Full Name</label>
                <input
                  id="fullname"
                  className="w-full bg-surface-container-highest border-none rounded-lg py-3 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Commander Name"
                  type="text"
                  value={signupForm.fullName}
                  onChange={(e) => setSignupForm((p) => ({ ...p, fullName: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="username">Username</label>
                  <input
                    id="username"
                    className="w-full bg-surface-container-highest border-none rounded-lg py-3 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary outline-none"
                    placeholder="ghost_explorer"
                    type="text"
                    value={signupForm.username}
                    onChange={(e) => setSignupForm((p) => ({ ...p, username: e.target.value }))}
                  />
                </div>

                <div className="group">
                  <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    className="w-full bg-surface-container-highest border-none rounded-lg py-3 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary outline-none"
                    placeholder="sat@geoclash.io"
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  className="w-full bg-surface-container-highest border-none rounded-lg py-3 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary outline-none"
                  placeholder="••••••••"
                  type="password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm((p) => ({ ...p, password: e.target.value }))}
                />
              </div>

              <div className="group">
                <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="confirm-password">Confirm Password</label>
                <input
                  id="confirm-password"
                  className="w-full bg-surface-container-highest border-none rounded-lg py-3 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary outline-none"
                  placeholder="••••••••"
                  type="password"
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                />
              </div>

              <button
                className="w-full bg-gradient-to-br from-primary to-primary-container py-4 rounded-lg font-headline font-bold text-on-primary-container text-base tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 kinetic-glow group disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "CREATE ACCOUNT"}
              </button>
            </form>
          )}

          {error && (
            <div className={`mt-4 text-sm ${error.toLowerCase().includes("created") ? "text-primary" : "text-error"}`}>
              {error}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-outline-variant/10 text-center relative z-10">
            <p className="text-on-surface-variant text-sm">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                className="text-primary font-semibold hover:underline underline-offset-4 ml-1"
                onClick={() => {
                  setMode((m) => (m === "login" ? "signup" : "login"));
                  setError("");
                }}
              >
                {mode === "login" ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-label text-on-surface-variant/40 tracking-[0.3em] uppercase">
            © 2024 GeoClash
          </p>
        </div>
      </main>

      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[10%] left-[5%] w-px h-32 bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
        <div className="absolute bottom-[20%] right-[10%] w-px h-48 bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
        <div className="absolute top-[30%] right-[15%] w-24 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>
    </div>
  );
}

export default Login;