"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function RecommendationForm({ onChange }: { onChange: (data: any) => void }) {
  const [data, setData] = useState({
    recommendations: ""
  });

  useEffect(() => {
    onChange(data);
  }, [data]);

  return (
    <Card className="glass-card p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Strategic Recommendations</Label>
          <Textarea 
            name="recommendations" 
            placeholder="Enter actionable advice for the client..." 
            className="min-h-[200px]"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData({ recommendations: e.target.value })}
          />
        </div>
      </div>
    </Card>
  );
}
