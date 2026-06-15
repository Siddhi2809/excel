import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center pt-24 pb-36 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-700" />

        <div className="container relative z-10 px-4 mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Zap className="w-4 h-4" />
            <span>Digital Marketing Excellence</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-tight text-foreground">
            Elevate Your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">
              Client Experience
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed font-sans">
            Jisnu Digital's premium reporting portal. Streamlined data submission, 
            real-time notifications, and professional performance insights for our valued partners.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full jisnu-gradient shadow-xl shadow-primary/20 text-white font-semibold group">
                Access Portal <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-border hover:bg-muted shadow-xs font-semibold">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-muted/40 border-t border-border/50">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl glass-card">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shadow-xs">
                <BarChart3 className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Instant Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">Detailed metrics for all social and digital platforms, updated instantly upon submission.</p>
            </div>
            
            <div className="p-8 rounded-3xl glass-card">
              <div className="w-12 h-12 rounded-2xl bg-secondary/15 flex items-center justify-center mb-6 shadow-xs">
                <Zap className="text-secondary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Real-time Alerts</h3>
              <p className="text-muted-foreground leading-relaxed">Notification badges ensure clients never miss a new performance update or strategic report.</p>
            </div>
            
            <div className="p-8 rounded-3xl glass-card">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 shadow-xs">
                <ShieldCheck className="text-emerald-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Secure Access</h3>
              <p className="text-muted-foreground leading-relaxed">Enterprise-grade security and role-based permissions to protect sensitive performance data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/60">
        <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">J</div>
            <span className="font-semibold text-foreground">Jisnu Digital</span>
          </div>
          <div>© 2026 Jisnu Digital. All rights reserved.</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
