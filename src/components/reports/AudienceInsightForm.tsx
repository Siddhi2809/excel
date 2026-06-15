"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function AudienceInsightForm({ onChange }: { onChange: (data: any) => void }) {
  const [data, setData] = useState({
    age: "",
    gender: "",
    topCities: "",
    interests: "",
    newVsReturning: "",
    details: ""
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
          <Label>Age Groups</Label>
          <Input name="age" placeholder="e.g. 18-24, 25-34" onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label>Gender Split</Label>
          <Input name="gender" placeholder="e.g. 60% Female" onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label>Top Cities</Label>
          <Input name="topCities" onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label>Interests</Label>
          <Input name="interests" onChange={handleChange} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>New vs Returning (%)</Label>
          <Input name="newVsReturning" onChange={handleChange} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Deep Details</Label>
          <Textarea name="details" placeholder="Elaborate on audience behavior..." onChange={handleChange} />
        </div>
      </div>
    </Card>
  );
}
