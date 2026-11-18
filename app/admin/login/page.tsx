"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, AlertCircle, Coffee } from "lucide-react";
import { CAFE_CONFIG } from "@/data/menu";
import { MOCK_STAFF_USERS } from "@/data/admin-mock";
import { useAdminUser } from "@/components/admin/AdminContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginWithEmail } = useAdminUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your staff email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    // Simulate authenticating against mock staff users
    setTimeout(() => {
      const user = loginWithEmail(trimmedEmail);

      if (!user) {
        setErrorMessage(
          "No staff account found with this email. Try one of the demo accounts below."
        );
        setIsLoading(false);
        return;
      }

      // Successful login -> navigate to dashboard
      router.push("/admin/dashboard");
    }, 400);
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-warm-white border border-caramel/25 shadow-xs mb-3 text-caramel">
            <Coffee className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-normal tracking-tight">
            {CAFE_CONFIG.name}
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-caramel font-semibold mt-1">
            Staff Portal Login
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-warm-white rounded-2xl border border-caramel/20 p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Inline Error Message */}
            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50/80 border border-red-200 text-red-800 text-xs leading-relaxed animate-fade-in"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="staff-email"
                className="block text-xs font-medium text-espresso"
              >
                Staff Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-mocha/60">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="staff-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  autoComplete="email"
                  required
                  placeholder="name@cakeeats.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-caramel/25 bg-cream/30 text-espresso text-sm placeholder:text-mocha/40 focus:outline-none focus:ring-2 focus:ring-caramel focus:border-caramel transition-colors"
                />
              </div>
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="space-y-1.5">
              <label
                htmlFor="staff-password"
                className="block text-xs font-medium text-espresso"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-mocha/60">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="staff-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-caramel/25 bg-cream/30 text-espresso text-sm placeholder:text-mocha/40 focus:outline-none focus:ring-2 focus:ring-caramel focus:border-caramel transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-mocha/70 hover:text-espresso transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-caramel text-warm-white text-sm font-medium hover:bg-caramel-dark active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shadow-xs flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-warm-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign in</span>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials for Reviewers */}
          <div className="mt-6 pt-5 border-t border-caramel/15">
            <p className="text-[11px] text-mocha font-medium uppercase tracking-wider mb-2 text-center">
              Quick Preview Demo Logins
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_STAFF_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleFillDemo(user.email)}
                  className="px-2.5 py-2 rounded-lg bg-cream/60 hover:bg-cream border border-caramel/20 text-left transition-colors text-xs flex flex-col group"
                >
                  <span className="font-medium text-espresso group-hover:text-caramel truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-caramel font-semibold">
                    Role: {user.role}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-mocha/70 text-center mt-2">
              Click any profile to auto-fill credentials for preview.
            </p>
          </div>
        </div>

        {/* Quiet Footer Note */}
        <p className="text-center text-[11px] text-mocha/70 mt-6">
          Authorized personnel only. Server-side session verification will be enforced on production deployment.
        </p>
      </div>
    </div>
  );
}
