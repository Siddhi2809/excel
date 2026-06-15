"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { REPORT_TYPES } from "@/lib/constants";
import { ArrowLeft, FileText, Loader2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ReportTypeView() {
  const params = useParams();
  const type = params.type as string;
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const reportConfig = REPORT_TYPES.find(t => t.id === type);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`/api/reports?type=${type}`);
        if (res.ok) {
          const data = await res.json();
          setReports(data);
          
          // Mark all unread reports of this type as "read"
          const hasUnread = data.some((r: any) => r.status === "unread");
          if (hasUnread) {
            await fetch("/api/reports", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type }),
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [type]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{reportConfig?.label}</h1>
            <p className="text-muted-foreground">Detailed history of your {reportConfig?.label.toLowerCase()} reports.</p>
          </div>
        </div>

        {reports.length === 0 ? (
          <Card className="glass-card flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <CardTitle>No Reports Found</CardTitle>
            <CardDescription>We haven't submitted any {reportConfig?.label.toLowerCase()} reports yet.</CardDescription>
          </Card>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <Card key={report._id} className="glass-card overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{report.month}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        Submitted on {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {report.status === "unread" && (
                      <Badge className="bg-primary/20 text-primary border-none">New Content</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Dynamic Rendering based on type */}
                  {renderReportData(type, report.data)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function renderReportData(type: string, data: any) {
  switch (type) {
    case "platform_overview": {
      // data is an array of platform objects from PlatformOverviewForm
      const platforms = Array.isArray(data) ? data : [data];
      return (
        <div className="space-y-6">
          {platforms.map((p: any, idx: number) => (
            <div key={idx} className="space-y-4">
              {platforms.length > 1 && (
                <h3 className="text-lg font-semibold text-primary border-b border-white/10 pb-2">
                  {p.platformName || `Platform ${idx + 1}`}
                </h3>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatBox label="Platform" value={p.platformName || "-"} />
                <StatBox label="Growth" value={p.growth || "0%"} />
                <StatBox label="Reach" value={p.reach || "0"} />
                <StatBox label="Impressions" value={p.impressions || "0"} />
                <StatBox label="Start Followers" value={p.followersStart || "0"} />
                <StatBox label="End Followers" value={p.followersEnd || "0"} />
                <StatBox label="Engagement Rate" value={p.engagementRate || "0%"} />
              </div>
            </div>
          ))}
        </div>
      );
    }
    case "top_post":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label="Platform" value={data.platform} />
            <StatBox label="Post Type" value={data.postType} />
            <StatBox label="Engagement" value={data.engagement} />
            <StatBox label="Reach" value={data.reach} />
          </div>
          {data.notes && (
            <div className="bg-muted/50 p-4 rounded-xl border border-white/5">
              <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Observations</h4>
              <p className="text-sm">{data.notes}</p>
            </div>
          )}
        </div>
      );
    case "ad_campaign":
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatBox label="Name" value={data.name} />
          <StatBox label="Objective" value={data.objective} />
          <StatBox label="Budget" value={data.budget} />
          <StatBox label="ROAS" value={data.roas} />
          <StatBox label="Reach" value={data.reach} />
          <StatBox label="Clicks" value={data.clicks} />
          <StatBox label="CPC" value={data.cpc} />
          <StatBox label="Conversions" value={data.conversion} />
        </div>
      );
    case "recommendation":
      return (
        <div className="prose prose-invert max-w-none">
          <p className="text-foreground whitespace-pre-wrap">{data.recommendations}</p>
        </div>
      );
    case "summary":
        return (
          <div className="prose prose-invert max-w-none">
            <p className="text-foreground whitespace-pre-wrap">{data.summary}</p>
          </div>
        );
    case "audience_insight":
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                Age Groups
              </p>
              <p className="text-lg font-bold">{data.age || "-"}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-pink-400"></span>
                Gender Split
              </p>
              <p className="text-lg font-bold">{data.gender || "-"}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                New vs Returning
              </p>
              <p className="text-lg font-bold">{data.newVsReturning || "-"}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
                Top Cities
              </p>
              <p className="text-lg font-bold">{data.topCities || "-"}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-400"></span>
                Interests
              </p>
              <p className="text-lg font-bold">{data.interests || "-"}</p>
            </div>
          </div>
          {data.details && (
            <div className="bg-muted/50 p-5 rounded-xl border border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400"></span>
                Deep Analysis
              </h4>
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{data.details}</p>
            </div>
          )}
        </div>
      );
    case "competitors_snapshot":
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-lg shrink-0">
              {(data.competitorName || "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xl font-bold">{data.competitorName || "Unknown Competitor"}</p>
              <p className="text-sm text-muted-foreground">Competitor Analysis</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                Followers
              </p>
              <p className="text-2xl font-bold">{data.followers ? Number(data.followers).toLocaleString() : "-"}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                Engagement Rate
              </p>
              <p className="text-2xl font-bold">{data.engagementRate || "-"}</p>
            </div>
          </div>
          {data.observation && (
            <div className="bg-muted/50 p-5 rounded-xl border border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>
                Key Observations
              </h4>
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{data.observation}</p>
            </div>
          )}
        </div>
      );
    default:
      return <pre className="text-xs overflow-auto p-4 bg-muted rounded">{JSON.stringify(data, null, 2)}</pre>;
  }
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-xl font-bold">{value || "-"}</p>
    </div>
  );
}
