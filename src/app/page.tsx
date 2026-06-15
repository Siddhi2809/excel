import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_var(--tw-gradient-stops))] from-primary/30 via-background to-background" />
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />

        <div className="container relative z-10 px-4 mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Zap className="w-4 h-4" />
            <span>Digital Marketing Excellence</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-tight">
            Elevate Your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-primary animate-gradient-x">
              Client Experience
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
            Jisnu Digital's premium reporting portal. Streamlined data submission, 
            real-time notifications, and professional performance insights for our valued partners.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full jisnu-gradient shadow-2xl shadow-primary/40 group">
                Access Portal <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-white/10 hover:bg-white/5 backdrop-blur-sm">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-muted/30 backdrop-blur-md">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-background/50 border border-white/5 glass-card">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                <BarChart3 className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Instant Analytics</h3>
              <p className="text-muted-foreground">Detailed metrics for all social and digital platforms, updated instantly upon submission.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-background/50 border border-white/5 glass-card">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
                <Zap className="text-blue-400 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Real-time Alerts</h3>
              <p className="text-muted-foreground">Notification badges ensure clients never miss a new performance update or strategic report.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-background/50 border border-white/5 glass-card">
              <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center mb-6">
                <ShieldCheck className="text-green-400 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Secure Access</h3>
              <p className="text-muted-foreground">Enterprise-grade security and role-based permissions to protect sensitive performance data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">J</div>
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
