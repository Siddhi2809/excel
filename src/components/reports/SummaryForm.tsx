"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SummaryForm({ onChange }: { onChange: (data: any) => void }) {
  const [data, setData] = useState({
    performanceSummary: "",
    keyHighlights: "",
    challenges: "",
    conclusions: ""
  });

  useEffect(() => {
    onChange(data);
  }, [data, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Card className="glass-card p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="performanceSummary" className="text-sm font-semibold text-foreground/80">Performance Summary</Label>
          <Textarea 
            id="performanceSummary"
            name="performanceSummary" 
            placeholder="Summarize the overall performance for this period..." 
            className="min-h-[100px]"
            value={data.performanceSummary}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="keyHighlights" className="text-sm font-semibold text-foreground/80">Key Highlights</Label>
          <Textarea 
            id="keyHighlights"
            name="keyHighlights" 
            placeholder="List the top wins, milestones, or achievements..." 
            className="min-h-[100px]"
            value={data.keyHighlights}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="challenges" className="text-sm font-semibold text-foreground/80">Challenges</Label>
          <Textarea 
            id="challenges"
            name="challenges" 
            placeholder="Detail any issues faced and how they are addressed..." 
            className="min-h-[100px]"
            value={data.challenges}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="conclusions" className="text-sm font-semibold text-foreground/80">Conclusions</Label>
          <Textarea 
            id="conclusions"
            name="conclusions" 
            placeholder="Summarize closing thoughts and next step directions..." 
            className="min-h-[100px]"
            value={data.conclusions}
            onChange={handleChange}
          />
        </div>
      </div>
    </Card>
  );
}
