"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg jisnu-gradient flex items-center justify-center font-bold text-white shadow-lg">
              J
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              Jisnu Digital
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {session.user?.name} 
                  <span className="ml-1 text-[10px] uppercase bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                    {(session.user as any).role}
                  </span>
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => signOut()} title="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" className="rounded-full shadow-lg">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
