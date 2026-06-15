"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { REPORT_TYPES } from "@/lib/constants";
import { ArrowLeft, FileText, Loader2, Calendar } from "lucide-react";
import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ReportTypeView() {
  const params = useParams();
  const type = params.type as string;
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

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

  const uniqueMonths = Array.from(new Set(reports.map(r => r.month))).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const filteredReports = selectedMonth === "all"
    ? reports
    : reports.filter(r => r.month === selectedMonth);

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60 pb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-primary/10 rounded-full shrink-0">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Button>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                {reportConfig?.id === "ad_campaign" ? "Ad Campaign Analytics" : reportConfig?.label}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">Detailed history of your {reportConfig?.label.toLowerCase()} reports.</p>
            </div>
          </div>
          
          {reports.length > 0 && (
            <div className="flex items-center gap-3 self-start md:self-center bg-white border border-border/80 rounded-xl px-4 py-2.5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
                <Icons.Calendar className="h-4 w-4 text-primary" />
                Select Month:
              </span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent border-0 text-sm font-bold focus:outline-none focus:ring-0 text-foreground cursor-pointer pr-6 py-0 focus:text-primary transition-colors duration-150"
              >
                <option value="all">All Months ({reports.length})</option>
                {uniqueMonths.map((m) => {
                  const count = reports.filter(r => r.month === m).length;
                  return (
                    <option key={m} value={m}>
                      {m} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>

        {reports.length === 0 ? (
          <Card className="glass-card flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <CardTitle>No Reports Found</CardTitle>
            <CardDescription>We haven't submitted any {reportConfig?.label.toLowerCase()} reports yet.</CardDescription>
          </Card>
        ) : filteredReports.length === 0 ? (
          <Card className="glass-card flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Icons.AlertCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <CardTitle>No Reports in {selectedMonth}</CardTitle>
            <CardDescription>There are no {reportConfig?.label.toLowerCase()} reports submitted for {selectedMonth}.</CardDescription>
          </Card>
        ) : (
          <div className="space-y-10">
            {filteredReports.map((report) => (
              <div key={report._id} className="bg-white shadow-xl rounded-2xl border border-border/70 overflow-hidden relative">
                {/* Decorative primary gradient border at top */}
                <div className="h-2 w-full jisnu-gradient" />
                
                {/* Report Document Header (Letterhead style) */}
                <div className="border-b border-border/60 bg-muted/5 px-8 py-8 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] tracking-widest font-extrabold text-primary uppercase">
                      Official Client Copy
                    </span>
                    <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                      {reportConfig?.id === "ad_campaign" ? "AD CAMPAIGN REPORT" : `${reportConfig?.label.toUpperCase()} REPORT`}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground pt-1">
                      <div className="flex items-center gap-1">
                        <Icons.Calendar className="h-3.5 w-3.5 text-primary/75" />
                        <span className="font-semibold text-foreground">{report.month}</span>
                      </div>
                      <span>•</span>
                      <span>Submitted: {new Date(report.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      Report ID: {report._id.slice(-8).toUpperCase()}
                    </span>
                    <div className="flex gap-2">
                      <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 px-3 py-1 font-bold text-xs uppercase tracking-wider rounded-md">
                        Verified
                      </Badge>
                      {report.status === "unread" && (
                        <Badge className="bg-primary/15 text-primary border border-primary/20 px-3 py-1 font-bold text-xs uppercase tracking-wider rounded-md animate-pulse">
                          New Release
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Report Document Body */}
                <div className="px-8 py-8 md:px-12 md:py-10">
                  {renderReportData(type, report.data)}
                </div>
                
                {/* Report Footer */}
                <div className="border-t border-border/50 bg-muted/5 px-8 py-4 md:px-12 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-muted-foreground font-medium">
                  <span>Prepared for Client Connection Portal</span>
                  <span className="mt-1 sm:mt-0">© {new Date().getFullYear()} Connection Portal. All Rights Reserved.</span>
                </div>
              </div>
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
      const platforms = Array.isArray(data) ? data : [data];
      return (
        <div className="space-y-12">
          {platforms.map((p: any, idx: number) => {
            const platformName = p.platformName || `Platform ${idx + 1}`;
            const startFollowers = parseFloat(p.followersStart) || 0;
            const endFollowers = parseFloat(p.followersEnd) || 0;
            const netGrowth = endFollowers - startFollowers;
            const growthPercent = startFollowers > 0 ? ((netGrowth / startFollowers) * 100).toFixed(1) : null;
            const isGrowthPositive = netGrowth >= 0;

            return (
              <div key={idx} className="border border-border/80 rounded-xl overflow-hidden shadow-sm bg-muted/5">
                {/* Platform Header */}
                <div className="bg-muted/30 border-b border-border/60 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Icons.Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-foreground tracking-tight">{platformName}</h3>
                      <p className="text-xs text-muted-foreground font-medium">Social Channel Performance</p>
                    </div>
                  </div>
                  {p.engagementRate && (
                    <Badge className="px-3 py-1 font-bold text-xs rounded-md bg-primary/10 text-primary border border-primary/20">
                      ER: {p.engagementRate}
                    </Badge>
                  )}
                </div>

                <div className="p-6 space-y-6">
                  {/* Followers Growth Narrative Section */}
                  <div className="bg-white p-5 rounded-xl border border-border/40 shadow-xs">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                      <Icons.Users className="h-3.5 w-3.5 text-primary" />
                      Audience Development
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground font-medium">Starting Audience</span>
                        <p className="text-2xl font-extrabold text-foreground">{startFollowers.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center justify-center md:justify-start">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/40 border border-border/50">
                          <Icons.ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground font-medium">Ending Audience</span>
                        <div className="flex flex-wrap items-baseline gap-3">
                          <p className="text-2xl font-extrabold text-foreground">{endFollowers.toLocaleString()}</p>
                          {growthPercent !== null && (
                            <span className={`text-xs font-bold flex items-center gap-0.5 px-2 py-0.5 rounded ${
                              isGrowthPositive ? "bg-emerald-500/10 text-emerald-700" : "bg-rose-500/10 text-rose-700"
                            }`}>
                              {isGrowthPositive ? "+" : ""}{netGrowth.toLocaleString()} ({isGrowthPositive ? "+" : ""}{growthPercent}%)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reach, Impressions, Growth */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl bg-white border border-border/40 space-y-1.5 shadow-xs">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Icons.TrendingUp className="h-3.5 w-3.5 text-primary/75" />
                        Engagement Rate
                      </p>
                      <p className="text-2xl font-extrabold text-foreground">{p.engagementRate || "-"}</p>
                      <p className="text-[10px] text-muted-foreground leading-normal font-medium">Total user interactions relative to impressions.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-border/40 space-y-1.5 shadow-xs">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Icons.Activity className="h-3.5 w-3.5 text-primary/75" />
                        Reach
                      </p>
                      <p className="text-2xl font-extrabold text-foreground">
                        {isNaN(Number(p.reach)) ? p.reach : Number(p.reach).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-normal font-medium">Unique accounts that viewed your content.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-border/40 space-y-1.5 shadow-xs">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Icons.Eye className="h-3.5 w-3.5 text-primary/75" />
                        Impressions
                      </p>
                      <p className="text-2xl font-extrabold text-foreground">
                        {isNaN(Number(p.impressions)) ? p.impressions : Number(p.impressions).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-normal font-medium">Total times your content was displayed on screen.</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    case "top_post": {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="border border-border/80 rounded-xl overflow-hidden bg-muted/5 p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5">
                <Icons.Award className="h-4 w-4 text-amber-500" />
                Featured Post Details
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-border/40">
                    <span className="text-xs text-muted-foreground font-medium">Social Platform</span>
                    <p className="text-lg font-extrabold text-foreground flex items-center gap-2 mt-1">
                      <Icons.Globe className="h-4 w-4 text-primary" />
                      {data.platform || "-"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-border/40">
                    <span className="text-xs text-muted-foreground font-medium">Content Type</span>
                    <p className="text-lg font-extrabold text-foreground mt-1 flex items-center gap-2">
                      <Icons.Sparkles className="h-4 w-4 text-secondary" />
                      {data.postType || "Post"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-border/40">
                    <span className="text-xs text-muted-foreground font-medium">Total Engagement</span>
                    <p className="text-2xl font-extrabold text-foreground mt-1">
                      {isNaN(Number(data.engagement)) ? data.engagement : Number(data.engagement).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-border/40">
                    <span className="text-xs text-muted-foreground font-medium">Total Reach</span>
                    <p className="text-2xl font-extrabold text-foreground mt-1">
                      {isNaN(Number(data.reach)) ? data.reach : Number(data.reach).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 flex flex-col justify-between">
            {data.notes ? (
              <div className="bg-primary/5 p-6 rounded-xl border border-primary/15 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
                    <Icons.MessageSquare className="h-4 w-4 text-primary" />
                    Creative Audit & Notes
                  </h4>
                  <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap font-medium">
                    {data.notes}
                  </p>
                </div>
                <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider border-t border-primary/10 pt-4 mt-6">
                  Recommended Creative Actions
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-border/80 rounded-xl p-6 flex flex-col items-center justify-center text-center h-full">
                <Icons.FileText className="h-8 w-8 text-muted-foreground/60 mb-2" />
                <p className="text-xs text-muted-foreground">No observation notes submitted for this post.</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    case "ad_campaign": {
      const budgetVal = data.budget;
      const formattedBudget = budgetVal && !budgetVal.toString().startsWith("$") && !isNaN(Number(budgetVal))
        ? `$${Number(budgetVal).toLocaleString()}`
        : budgetVal;

      const roasVal = data.roas;
      const formattedRoas = roasVal && !isNaN(Number(roasVal)) ? `${roasVal}x` : roasVal;

      const cpcVal = data.cpc;
      const formattedCpc = cpcVal && !cpcVal.toString().startsWith("$") && !isNaN(Number(cpcVal))
        ? `$${Number(cpcVal).toFixed(2)}`
        : cpcVal;

      return (
        <div className="space-y-8">
          {/* Ad Campaign Header Block */}
          <div className="bg-muted/10 border border-border/80 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Campaign Identity</span>
              <h3 className="text-2xl font-extrabold text-foreground tracking-tight">{data.name || "Untitled Campaign"}</h3>
              <p className="text-sm text-primary font-medium">Objective: {data.objective || "Brand Awareness"}</p>
            </div>
            
            <div className="bg-primary text-white px-6 py-4 rounded-xl flex flex-col justify-center shadow-lg shadow-primary/20">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-white/70">Return on Ad Spend</span>
              <p className="text-3xl font-extrabold tracking-tight">{formattedRoas || "-"}</p>
            </div>
          </div>

          {/* Financial Scorecard Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-white border border-border/40 shadow-xs space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Icons.Coins className="h-3.5 w-3.5 text-primary/75" />
                Budget Allocation
              </p>
              <p className="text-xl font-extrabold text-foreground">{formattedBudget || "-"}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Total financial investment.</p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-border/40 shadow-xs space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Icons.MousePointerClick className="h-3.5 w-3.5 text-primary/75" />
                Clicks Received
              </p>
              <p className="text-xl font-extrabold text-foreground">
                {isNaN(Number(data.clicks)) ? data.clicks : Number(data.clicks).toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium">Total links or CTA clicks.</p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-border/40 shadow-xs space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Icons.DollarSign className="h-3.5 w-3.5 text-primary/75" />
                Avg CPC
              </p>
              <p className="text-xl font-extrabold text-foreground">{formattedCpc || "-"}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Cost incurred per click.</p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-border/40 shadow-xs space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Icons.CheckCircle2 className="h-3.5 w-3.5 text-primary/75" />
                Conversions
              </p>
              <p className="text-xl font-extrabold text-foreground">
                {isNaN(Number(data.conversion)) ? data.conversion : Number(data.conversion).toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium">Acquisitions or goal actions.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/5 p-6 rounded-xl border border-border/60">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Estimated Campaign Reach</span>
              <p className="text-2xl font-extrabold text-foreground">
                {isNaN(Number(data.reach)) ? data.reach : Number(data.reach).toLocaleString()} accounts
              </p>
              <p className="text-xs text-muted-foreground font-medium">Total number of unique users exposed to the campaign ads.</p>
            </div>
            
            <div className="flex items-center md:justify-end">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 text-emerald-800 flex items-start gap-3 max-w-sm">
                <Icons.Info className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed font-semibold">
                  A ROAS of <span className="font-extrabold">{formattedRoas || "N/A"}</span> indicates strong marketing efficiency and profit scaling.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    case "audience_insight": {
      return (
        <div className="space-y-8">
          {/* Demographic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-white border border-border/60 shadow-xs space-y-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-1 w-full bg-blue-500" />
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Icons.Users className="h-4 w-4 text-blue-500" />
                Target Age Profile
              </p>
              <p className="text-2xl font-extrabold text-foreground">{data.age || "-"}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Dominant age distribution segment.</p>
            </div>
            
            <div className="p-5 rounded-xl bg-white border border-border/60 shadow-xs space-y-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-1 w-full bg-pink-500" />
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Icons.Activity className="h-4 w-4 text-pink-500" />
                Gender Split
              </p>
              <p className="text-2xl font-extrabold text-foreground">{data.gender || "-"}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Percentage distribution by gender.</p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-border/60 shadow-xs space-y-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500" />
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Icons.RefreshCw className="h-4 w-4 text-emerald-500" />
                Audience Retention
              </p>
              <p className="text-2xl font-extrabold text-foreground">{data.newVsReturning || "-"}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Ratio of new visitors vs loyal users.</p>
            </div>
          </div>

          {/* Behavior and Interests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-muted/5 border border-border/80 shadow-xs space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Icons.MapPin className="h-4 w-4 text-primary" />
                Top Geographic Cities
              </p>
              <p className="text-lg font-extrabold text-foreground">{data.topCities || "-"}</p>
              <p className="text-xs text-muted-foreground leading-normal font-medium">Highest concentration of user engagement by location.</p>
            </div>

            <div className="p-5 rounded-xl bg-muted/5 border border-border/80 shadow-xs space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Icons.Sparkles className="h-4 w-4 text-secondary" />
                Interest Demographics
              </p>
              <p className="text-lg font-extrabold text-foreground">{data.interests || "-"}</p>
              <p className="text-xs text-muted-foreground leading-normal font-medium">Aligned content categories based on affinity groups.</p>
            </div>
          </div>

          {/* Deep Insight Analysis Section */}
          {data.details && (
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/15 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Icons.Compass className="h-4 w-4 text-primary" />
                Executive Audience Analysis
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap font-medium">
                {data.details}
              </p>
            </div>
          )}
        </div>
      );
    }
    case "competitors_snapshot": {
      const initialLetter = (data.competitorName || "?").charAt(0).toUpperCase();
      return (
        <div className="space-y-8">
          {/* Competitor Profile block */}
          <div className="flex items-center gap-4 p-6 rounded-xl bg-gradient-to-r from-amber-500/5 to-rose-500/5 border border-amber-500/10 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
              {initialLetter}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Market Snapshot Partner</p>
              <p className="text-2xl font-extrabold text-foreground tracking-tight">{data.competitorName || "Unnamed Competitor"}</p>
            </div>
          </div>

          {/* Benchmarks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-white border border-border/60 shadow-xs space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Icons.Users className="h-4 w-4 text-blue-500" />
                Competitor Audience Size
              </p>
              <p className="text-3xl font-extrabold text-foreground">
                {data.followers ? (isNaN(Number(data.followers)) ? data.followers : Number(data.followers).toLocaleString()) : "-"}
              </p>
              <p className="text-xs text-muted-foreground font-medium">Total reported social reach of this benchmark competitor.</p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-border/60 shadow-xs space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Icons.Activity className="h-4 w-4 text-emerald-500" />
                Competitor Engagement Rate
              </p>
              <p className="text-3xl font-extrabold text-foreground">{data.engagementRate || "-"}</p>
              <p className="text-xs text-muted-foreground font-medium">Benchmark interaction efficiency score.</p>
            </div>
          </div>

          {/* Insights observation */}
          {data.observation && (
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/15 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Icons.Eye className="h-4 w-4 text-primary" />
                Competitive Position Analysis
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap font-medium">
                {data.observation}
              </p>
            </div>
          )}
        </div>
      );
    }
    case "recommendation": {
      const hasDetailedFields = data.newContentIdeas || data.suggestedCampaigns || data.postingFrequency || data.platformStrategyUpdates;
      return (
        <div className="space-y-8">
          {hasDetailedFields ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.newContentIdeas && (
                <div className="p-6 rounded-xl bg-primary/5 border border-primary/15 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-base font-extrabold text-primary flex items-center gap-2 tracking-tight">
                      <Icons.Lightbulb className="h-5 w-5 text-amber-500 animate-pulse" />
                      New Content Ideas
                    </h4>
                    <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed font-medium">{data.newContentIdeas}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground/75 font-semibold uppercase tracking-wider border-t border-primary/10 pt-3 mt-4">Growth Direction</span>
                </div>
              )}

              {data.suggestedCampaigns && (
                <div className="p-6 rounded-xl bg-secondary/5 border border-secondary/15 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-base font-extrabold text-secondary flex items-center gap-2 tracking-tight">
                      <Icons.Rocket className="h-5 w-5 text-secondary" />
                      Suggested Campaigns
                    </h4>
                    <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed font-medium">{data.suggestedCampaigns}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground/75 font-semibold uppercase tracking-wider border-t border-secondary/10 pt-3 mt-4">Campaign Blueprint</span>
                </div>
              )}

              {data.postingFrequency && (
                <div className="p-6 rounded-xl bg-blue-500/5 border border-blue-500/10 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-base font-extrabold text-blue-600 flex items-center gap-2 tracking-tight">
                      <Icons.CalendarRange className="h-5 w-5 text-blue-500" />
                      Posting Frequency
                    </h4>
                    <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed font-medium">{data.postingFrequency}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground/75 font-semibold uppercase tracking-wider border-t border-blue-500/10 pt-3 mt-4">Schedule Planning</span>
                </div>
              )}

              {data.platformStrategyUpdates && (
                <div className="p-6 rounded-xl bg-purple-500/5 border border-purple-500/10 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-base font-extrabold text-purple-600 flex items-center gap-2 tracking-tight">
                      <Icons.TrendingUp className="h-5 w-5 text-purple-500" />
                      Platform Strategy Updates
                    </h4>
                    <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed font-medium">{data.platformStrategyUpdates}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground/75 font-semibold uppercase tracking-wider border-t border-purple-500/10 pt-3 mt-4">Strategic Realignment</span>
                </div>
              )}
            </div>
          ) : (
            // Fallback for older single-textarea recommendations
            <div className="prose max-w-none p-6 rounded-xl bg-primary/5 border border-primary/10">
              <h4 className="text-sm font-extrabold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                <Icons.Compass className="h-4 w-4 text-primary" />
                Strategic Recommendations
              </h4>
              <p className="text-foreground/90 whitespace-pre-wrap text-base leading-relaxed font-medium">{data.recommendations}</p>
            </div>
          )}
        </div>
      );
    }
    case "summary": {
      const hasDetailedFields = data.performanceSummary || data.keyHighlights || data.challenges || data.conclusions;
      return (
        <div className="space-y-8">
          {hasDetailedFields ? (
            <div className="space-y-6">
              {data.performanceSummary && (
                <div className="p-6 rounded-xl bg-muted/30 border border-border/80 shadow-xs space-y-2 relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-1.5 bg-primary" />
                  <h4 className="text-base font-extrabold text-primary flex items-center gap-2 tracking-tight pl-1">
                    <Icons.TrendingUp className="h-5 w-5 text-primary" />
                    Performance Executive Summary
                  </h4>
                  <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed font-medium pl-1">{data.performanceSummary}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.keyHighlights && (
                  <div className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/10 shadow-xs space-y-2 relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-500" />
                    <h4 className="text-base font-extrabold text-emerald-800 flex items-center gap-2 tracking-tight pl-1">
                      <Icons.CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      Key Highlights & Accomplishments
                    </h4>
                    <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed font-medium pl-1">{data.keyHighlights}</p>
                  </div>
                )}

                {data.challenges && (
                  <div className="p-6 rounded-xl bg-amber-500/5 border border-amber-500/10 shadow-xs space-y-2 relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-500" />
                    <h4 className="text-base font-extrabold text-amber-800 flex items-center gap-2 tracking-tight pl-1">
                      <Icons.AlertCircle className="h-5 w-5 text-amber-600" />
                      Strategic Challenges & Bottlenecks
                    </h4>
                    <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed font-medium pl-1">{data.challenges}</p>
                  </div>
                )}
              </div>

              {data.conclusions && (
                <div className="p-6 rounded-xl bg-secondary/5 border border-secondary/15 shadow-xs space-y-2 relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-1.5 bg-secondary" />
                  <h4 className="text-base font-extrabold text-secondary flex items-center gap-2 tracking-tight pl-1">
                    <Icons.Compass className="h-5 w-5 text-secondary" />
                    Conclusions & Next Strategic Steps
                  </h4>
                  <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed font-medium pl-1">{data.conclusions}</p>
                </div>
              )}
            </div>
          ) : (
            // Fallback for older summaries
            <div className="prose max-w-none p-6 rounded-xl bg-muted/40 border border-border/80">
              <h4 className="text-sm font-extrabold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Icons.ClipboardList className="h-4 w-4 text-muted-foreground" />
                Performance Executive Summary
              </h4>
              <p className="text-foreground/90 whitespace-pre-wrap text-base leading-relaxed font-medium">{data.summary}</p>
            </div>
          )}
        </div>
      );
    }
    default:
      return <pre className="text-xs overflow-auto p-4 bg-muted rounded border border-border/40">{JSON.stringify(data, null, 2)}</pre>;
  }
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-muted/40 border border-border/60 shadow-xs space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-xl font-bold text-foreground">{value || "-"}</p>
    </div>
  );
}
