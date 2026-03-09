import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
import { motion } from "motion/react";
import { type KeyboardEvent, useState } from "react";

interface SplashPageProps {
  onUnlock: () => void;
}

export function SplashPage({ onUnlock }: SplashPageProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = () => {
    if (password === "Escambia") {
      onUnlock();
    } else {
      setError("Incorrect password. Please try again.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      setPassword("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
    if (error) {
      setError("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, oklch(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        {/* Card */}
        <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
          {/* Header band */}
          <div className="bg-primary/8 border-b border-border px-8 py-6 flex flex-col items-center gap-4">
            {/* Logo + Shield */}
            <div className="relative">
              <img
                src="/assets/generated/status-logo.dim_128x128.png"
                alt="District Status Page"
                className="w-14 h-14 object-contain"
              />
              <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                <Shield className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                District Status Page
              </h1>
              <p className="text-xs text-muted-foreground font-mono mt-0.5 uppercase tracking-widest">
                IT Operations
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-6 space-y-4">
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground text-center">
                Enter your access password to continue.
              </p>
            </div>

            {/* Password input */}
            <motion.div
              animate={isShaking ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={handleKeyDown}
                className="pl-9 pr-10 font-mono"
                autoComplete="current-password"
                autoFocus
                data-ocid="splash.input"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </motion.div>

            {/* Error message */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-destructive font-mono text-center"
                data-ocid="splash.error_state"
                role="alert"
              >
                {error}
              </motion.p>
            )}

            {/* Submit button */}
            <Button
              className="w-full"
              onClick={handleSubmit}
              data-ocid="splash.submit_button"
            >
              Access Dashboard
            </Button>
          </div>
        </div>

        {/* Footer attribution */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()} District IT Operations
        </p>
      </motion.div>
    </div>
  );
}
