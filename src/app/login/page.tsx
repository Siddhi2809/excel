"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Login Failed", {
          description: "Invalid email or password. Please try again.",
        });
      } else {
        router.push("/dashboard");
        router.refresh();
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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background">
      <Card className="w-full max-w-md glass-card border border-border/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 jisnu-gradient" />
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto w-12 h-12 rounded-xl jisnu-gradient flex items-center justify-center mb-2 shadow-lg shadow-primary/15">
            <Lock className="text-white h-5 w-5" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access the Jisnu Digital Portal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground/80">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@jisnudigital.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 px-4 bg-background border-border/80 focus:border-primary/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-foreground/80">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 px-4 bg-background border-border/80 focus:border-primary/50 transition-all"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold jisnu-gradient hover:opacity-95 transition-all shadow-lg shadow-primary/20 text-white rounded-lg mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Login to Portal"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <div className="text-sm text-center text-muted-foreground">
            Are you an employee?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Register here
            </Link>
          </div>
          <div className="text-xs text-center text-muted-foreground/60">
            Employee and Client access only. For inquiries, contact support@jisnudigital.com
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
