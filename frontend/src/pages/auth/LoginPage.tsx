import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../store/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { getApiErrorMessage } from "../../services/apiClient";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate("/dashboard");
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
          <h2 className="mb-1">CloudWise AI</h2>
          <p className="caption">Your AI FinOps Copilot</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && (
            <div className="badge badge-danger w-full justify-center py-2">{error}</div>
          )}

          <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
            Sign In
          </Button>
        </form>

        <p className="caption text-center mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-(--color-accent-hover) font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
