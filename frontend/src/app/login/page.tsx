"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.access_token, data.user);
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center py-20 px-4">
      <div className="w-full max-w-md space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
            Welcome Back
          </h1>
          <p className="mt-4 text-sm text-muted-foreground uppercase tracking-widest">
            Sign in to continue your journey
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <Input
                id="email"
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-secondary/30 border-transparent focus:bg-background transition-colors"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <Input
                id="password"
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-secondary/30 border-transparent focus:bg-background transition-colors"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-sm uppercase tracking-widest font-bold" isLoading={isLoading}>
            Sign In
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-foreground hover:underline underline-offset-4">
              Join Narrative
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
