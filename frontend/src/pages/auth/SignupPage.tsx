import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../store/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { getApiErrorMessage } from "../../services/apiClient";

export function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        email,
        password,
        first_name: firstName || undefined,
        last_name: lastName || undefined,
      });
      // Per AFD: successful signup redirects to /onboarding
      navigate("/onboarding");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md relative">
        <Link to="/" className="absolute top-4 left-4 text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="mb-6 text-center mt-2">
          <h2 className="mb-1">Create your account</h2>
          <p className="caption">Start optimizing your cloud costs</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="firstName"
              label="First name"
              placeholder="Akhil"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
            />
            <Input
              id="lastName"
              label="Last name"
              placeholder="Varghese"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
            />
          </div>

          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={8}
          />
          <Input
            id="confirmPassword"
            type="password"
            label="Confirm password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          {error && (
            <div className="badge badge-danger w-full justify-center py-2">{error}</div>
          )}

          <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
            Create Account
          </Button>
        </form>

        <p className="caption text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-(--color-accent-hover) font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
