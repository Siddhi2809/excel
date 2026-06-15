"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function RecommendationForm({ onChange }: { onChange: (data: any) => void }) {
  const [data, setData] = useState({
    newContentIdeas: "",
    suggestedCampaigns: "",
    postingFrequency: "",
    platformStrategyUpdates: ""
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
          <Label htmlFor="newContentIdeas" className="text-sm font-semibold text-foreground/80">New Content Ideas</Label>
          <Textarea 
            id="newContentIdeas"
            name="newContentIdeas" 
            placeholder="Describe fresh concepts for posts, videos, or campaigns..." 
            className="min-h-[100px]"
            value={data.newContentIdeas}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="suggestedCampaigns" className="text-sm font-semibold text-foreground/80">Suggested Campaigns</Label>
          <Textarea 
            id="suggestedCampaigns"
            name="suggestedCampaigns" 
            placeholder="Detail any specific target campaigns or promotions..." 
            className="min-h-[100px]"
            value={data.suggestedCampaigns}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postingFrequency" className="text-sm font-semibold text-foreground/80">Posting Frequency</Label>
          <Textarea 
            id="postingFrequency"
            name="postingFrequency" 
            placeholder="Specify recommended timing and post volume..." 
            className="min-h-[100px]"
            value={data.postingFrequency}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="platformStrategyUpdates" className="text-sm font-semibold text-foreground/80">Platform Strategy Updates</Label>
          <Textarea 
            id="platformStrategyUpdates"
            name="platformStrategyUpdates" 
            placeholder="Outline structural or bio changes across channels..." 
            className="min-h-[100px]"
            value={data.platformStrategyUpdates}
            onChange={handleChange}
          />
        </div>
      </div>
    </Card>
  );
}
