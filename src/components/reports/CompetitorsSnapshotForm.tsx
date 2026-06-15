"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

export default function CompetitorsSnapshotForm({ onChange }: { onChange: (data: any) => void }) {
  const [data, setData] = useState({
    competitorName: "",
    followers: "",
    engagementRate: "",
    observation: ""
  });

  useEffect(() => {
    onChange(data);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
  <Card className="glass-card p-6">
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label>Competitor Name</Label>
        <Input name="competitorName" onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label>Followers</Label>
        <Input name="followers" type="number" onChange={handleChange} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Engagement Rate (%)</Label>
        <Input name="engagementRate" onChange={handleChange} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Observation</Label>
        <Textarea name="observation" placeholder="What are they doing better or differently?" onChange={handleChange} />
      </div>
    </div>
  </Card>
);
}
