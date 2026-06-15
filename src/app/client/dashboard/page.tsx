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
    <Container>
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Client Portal</h1>
            <p className="text-muted-foreground mt-2">Welcome back! Here are your marketing analytics.</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 bg-primary/5">
              {reports.length} Total Reports
            </Badge>

          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REPORT_TYPES.map((type) => {
            const IconComponent = (Icons as any)[type.icon];
            const unreadCount = getUnreadCount(type.id);

            return (
              <Link key={type.id} href={`/client/reports/${type.id}`} onClick={() => handleCardClick(type.id)}>
                <Card className="glass-card group hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden border-white/5">
                  <div className={`absolute top-0 left-0 w-full h-1 transition-all ${unreadCount > 0 && !viewedTypes.includes(type.id) ? "jisnu-gradient opacity-100" : "bg-muted opacity-20"}`} />
                  
                  {unreadCount > 0 && !viewedTypes.includes(type.id) && (
                    <div className="absolute top-4 right-4 animate-bounce">
                      <div className="bg-red-500 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40">
                        {unreadCount}
                      </div>
                    </div>
                  )}

                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <div className={`p-3 rounded-xl transition-all ${unreadCount > 0 && !viewedTypes.includes(type.id) ? "bg-primary/20 text-primary shadow-lg shadow-primary/10" : "bg-muted text-muted-foreground"}`}>
                      {IconComponent && <IconComponent className="h-6 w-6" />}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{type.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      View your latest {type.label.toLowerCase()} analytics, trends, and performance data.
                    </p>
                    <div className="mt-4 flex items-center text-xs font-semibold text-primary/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Reports <Icons.ChevronRight className="h-3 w-3 ml-1" />
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
