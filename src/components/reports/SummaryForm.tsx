"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

export default function SummaryForm({ onChange }: { onChange: (data: any) => void }) {
  const [data, setData] = useState({
    summary: ""
  });

  useEffect(() => {
    onChange(data);
  }, [data]);

  return (
    <Card className="glass-card p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Performance Summary</Label>
          <Textarea 
            name="summary" 
            placeholder="Summarize the overall performance for this period..." 
            className="min-h-[200px]"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData({ summary: e.target.value })}
          />
        </div>
      </div>
    </Card>
  );
}
