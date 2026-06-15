"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export default function AdCampaignForm({ onChange }: { onChange: (data: any) => void }) {
  const [data, setData] = useState({
    name: "",
    objective: "",
    budget: "",
    reach: "",
    clicks: "",
    cpc: "",
    conversion: "",
    roas: ""
  });

  useEffect(() => {
    onChange(data);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label>Campaign Name</Label>
        <Input name="name" onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label>Objective</Label>
        <Input name="objective" onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label>Budget</Label>
        <Input name="budget" type="number" onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label>Reach</Label>
        <Input name="reach" type="number" onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label>Clicks</Label>
        <Input name="clicks" type="number" onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label>CPC</Label>
        <Input name="cpc" placeholder="e.g. $0.45" onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label>Conversion</Label>
        <Input name="conversion" type="number" onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label>ROAS</Label>
        <Input name="roas" placeholder="e.g. 4.5x" onChange={handleChange} />
      </div>
    </div>
  );
}
