"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Mail, ChevronRight } from "lucide-react";
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
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 overflow-hidden bg-gradient-to-tr from-slate-50 via-slate-100/50 to-slate-50">
      {/* Decorative background components */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-secondary/5 rounded-full blur-[140px] pointer-events-none" />
      
      <Card className="w-full max-w-[440px] border border-border/80 bg-white/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(8,112,184,0.06)] rounded-2xl relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-1.5 jisnu-gradient" />
        
        <CardHeader className="space-y-4 text-center pt-10 pb-6 px-8">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-xs border border-primary/20 text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-800 font-display">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 font-sans">
              Enter your credentials to access the Jisnu Digital Portal
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="px-8 pb-4">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold tracking-wide uppercase text-slate-500">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@jisnudigital.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-4 pr-10 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border-slate-200/80 focus:border-primary/80 rounded-xl transition-all shadow-xs"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold tracking-wide uppercase text-slate-500">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-4 pr-10 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border-slate-200/80 focus:border-primary/80 rounded-xl transition-all shadow-xs"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 mt-6 text-sm tracking-wider uppercase font-bold jisnu-gradient text-white rounded-xl shadow-md shadow-primary/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-[1px] active:translate-y-[1px] group"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                  Authenticating...
                </>
              ) : (
                <span className="flex items-center justify-center gap-1">
                  Sign In <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 pt-4 pb-10 px-8 border-t border-slate-100">
          <div className="text-sm text-center text-slate-500 font-sans">
            Are you an employee?{" "}
            <Link href="/register" className="text-primary hover:text-primary/95 font-semibold hover:underline">
              Register here
            </Link>
          </div>
          <div className="text-[11px] text-center text-slate-400 font-sans leading-relaxed">
            Employee and Client access only. For inquiries, contact <a href="mailto:support@jisnudigital.com" className="hover:text-primary hover:underline">support@jisnudigital.com</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
