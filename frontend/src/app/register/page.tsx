"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/auth/register", formData);
      toast.success("Account created successfully. Please login.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center py-20 px-4">
      <div className="w-full max-w-md space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
            Join Narrative
          </h1>
          <p className="mt-4 text-sm text-muted-foreground uppercase tracking-widest">
            Create an account to start writing
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <Input
                id="username"
                type="text"
                required
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="h-12 bg-secondary/30 border-transparent focus:bg-background transition-colors"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <Input
                id="email"
                type="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="h-12 bg-secondary/30 border-transparent focus:bg-background transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <Input
                id="password"
                type="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="h-12 bg-secondary/30 border-transparent focus:bg-background transition-colors"
                minLength={6}
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-sm uppercase tracking-widest font-bold" isLoading={isLoading}>
            Create Account
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-foreground hover:underline underline-offset-4">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
