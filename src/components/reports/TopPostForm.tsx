"use client";
import { Card } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

export default function TopPostForm({ onChange }: { onChange: (data: any) => void }) {
  const [data, setData] = useState({
    platform: "",
    date: "",
    postType: "",
    engagement: "",
    reach: "",
    notes: ""
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
          <Label>Platform</Label>
          <Input name="platform" placeholder="e.g. Facebook" onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label>Date</Label>
          <Input name="date" type="date" onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label>Post Type</Label>
          <Input name="postType" placeholder="e.g. Video, Image, Reel" onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label>Engagement</Label>
          <Input name="engagement" type="number" onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label>Reach</Label>
          <Input name="reach" type="number" onChange={handleChange} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Notes</Label>
          <Textarea name="notes" placeholder="Observations about this post..." onChange={handleChange} />
        </div>
      </div>
    </Card>
  );
}
