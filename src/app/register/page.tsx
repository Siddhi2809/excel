"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Validation Error", {
        description: "Passwords do not match.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registration Successful", {
          description: "Your employee account has been created. Redirecting to login...",
        });
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.error("Registration Failed", {
          description: data.error || "Something went wrong.",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background animate-in fade-in duration-500">
      <Card className="w-full max-w-md glass-card border border-border/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 jisnu-gradient" />
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto w-12 h-12 rounded-xl jisnu-gradient flex items-center justify-center mb-2 shadow-lg shadow-primary/15">
            <UserPlus className="text-white h-5 w-5" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">Create Employee Account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Register to manage clients and post performance reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-semibold text-foreground/80">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 bg-background border-border/80 focus:border-primary/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground/80">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@jisnudigital.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-background border-border/80 focus:border-primary/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-semibold text-foreground/80">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 bg-background border-border/80 focus:border-primary/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground/80">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 bg-background border-border/80 focus:border-primary/50 transition-all"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold jisnu-gradient hover:opacity-95 transition-all shadow-lg shadow-primary/20 text-white rounded-lg mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </div>
          <div className="text-xs text-center text-muted-foreground/60">
            For client portal registration, contact administration.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
