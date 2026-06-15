"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Container from "@/components/ui/Container";
import { Badge } from "@/components/ui/badge";
import { REPORT_TYPES } from "@/lib/constants";
import * as Icons from "lucide-react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const REPORT_DESCRIPTIONS: Record<string, string> = {
  platform_overview: "Aggregated performance metrics across active channels, including engagement, reach, and follower trends.",
  top_post: "Analysis of high-performing organic content, creative assets, and post engagement highlights.",
  ad_campaign: "Financial summary, budget allocations, ROAS, conversion metrics, and paid acquisition channel performance.",
  audience_insight: "Demographic segmentation, behavior trends, geographic spread, and deep audience profile analysis.",
  competitors_snapshot: "Market benchmarking comparing share of voice, follower count, and engagement rates against competitors.",
  recommendation: "Actionable strategic directions, proposed campaign ideas, optimal posting frequencies, and platform updates.",
  summary: "High-level performance summaries, key achievements, project bottleneck analysis, and strategic conclusions."
};

export default function ClientDashboard() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/reports");
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        }
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const [viewedTypes, setViewedTypes] = useState<string[]>([]);

  const handleCardClick = (typeId: string) => {
    setViewedTypes((prev) => [...prev, typeId]);
  };

  const getUnreadCount = (type: string) => {
    return reports.filter(r => r.type === type && r.status === "unread").length;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Container className="py-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Client Portal</h1>
            <p className="text-muted-foreground mt-2 text-base">Welcome back! Here are your marketing analytics.</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-foreground/80 tracking-wide uppercase">Active Connection</span>
            </div>
            <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/25 bg-primary/10 text-primary font-bold text-sm">
              {reports.length} Total Reports
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {REPORT_TYPES.map((type) => {
            const IconComponent = (Icons as any)[type.icon];
            const unreadCount = getUnreadCount(type.id);
            const isNew = unreadCount > 0 && !viewedTypes.includes(type.id);

            return (
              <Link
                key={type.id}
                href={`/client/reports/${type.id}`}
                onClick={() => handleCardClick(type.id)}
                className="flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
              >
                <Card className="glass-card group flex flex-col justify-between h-full cursor-pointer relative overflow-hidden border border-border/80 shadow-md hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300">
                  <div className={`absolute top-0 left-0 w-full h-1.5 transition-all duration-300 ${isNew ? "jisnu-gradient opacity-100" : "bg-muted/40 opacity-20"}`} />
                  
                  {isNew && (
                    <div className="absolute top-4 right-4">
                      <span className="relative flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary"></span>
                      </span>
                    </div>
                  )}

                  <CardHeader className="flex flex-row items-center space-x-4 pb-2 pt-6">
                    <div className={`p-3 rounded-xl transition-all duration-300 ${isNew ? "bg-primary/20 text-primary shadow-md scale-105" : "bg-primary/5 text-primary/75 group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105"}`}>
                      {IconComponent && <IconComponent className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                        {type.id === "ad_campaign" ? "Ad Campaign Analysis" : type.label}
                      </CardTitle>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/80">
                        Analytics Channel
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex flex-col flex-grow justify-between pt-2 pb-6">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {REPORT_DESCRIPTIONS[type.id] || `View your latest ${type.label.toLowerCase()} analytics, trends, and performance data.`}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs font-semibold text-primary pt-3 border-t border-border/40 mt-auto">
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">Access Analytics Report</span>
                      <Icons.ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
