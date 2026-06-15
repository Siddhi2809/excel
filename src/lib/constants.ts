export const REPORT_TYPES = [
  { id: "platform_overview", label: "Platform Overview", icon: "Layout" },
  { id: "top_post", label: "Top Post", icon: "TrendingUp" },
  { id: "ad_campaign", label: "Add Campaign", icon: "Target" },
  { id: "audience_insight", label: "Audience Insight", icon: "Users" },
  { id: "competitors_snapshot", label: "Competitors Snapshot", icon: "Eye" },
  { id: "recommendation", label: "Recommendation", icon: "Lightbulb" },
  { id: "summary", label: "Summary", icon: "ClipboardList" },
] as const;

export type ReportType = typeof REPORT_TYPES[number]["id"];
