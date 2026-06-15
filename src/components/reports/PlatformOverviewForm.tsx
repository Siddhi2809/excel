import { Card } from "@/components/ui/card";
import { Spacer } from "@/components/ui/Spacer";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Define available platforms (could be fetched from an API later)
const AVAILABLE_PLATFORMS = [
  "Instagram",
  "Facebook",
  "Twitter",
  "LinkedIn",
  "TikTok",
  "YouTube",
];

export interface PlatformData {
  platformName: string;
  followersStart: string;
  followersEnd: string;
  growth: string;
  engagementRate: string;
  reach: string;
  impressions: string;
}

export default function PlatformOverviewForm({ onChange }: { onChange: (data: PlatformData[]) => void }) {
  const [platforms, setPlatforms] = useState<PlatformData[]>([
    {
      platformName: "",
      followersStart: "",
      followersEnd: "",
      growth: "",
      engagementRate: "",
      reach: "",
      impressions: "",
    },
  ]);

  // Notify parent whenever data changes
  useEffect(() => {
    onChange(platforms);
  }, [platforms, onChange]);

  const handleFieldChange = (index: number, field: keyof PlatformData, value: string) => {
    const updated = [...platforms];
    updated[index][field] = value;
    setPlatforms(updated);
  };

  const addPlatform = () => {
    setPlatforms((prev) => [
      ...prev,
      {
        platformName: "",
        followersStart: "",
        followersEnd: "",
        growth: "",
        engagementRate: "",
        reach: "",
        impressions: "",
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {platforms.map((p, idx) => (
        <Card key={idx} className="glass-card p-6 relative">
          {platforms.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
              onClick={() => {
                const updated = platforms.filter((_, i) => i !== idx);
                setPlatforms(updated);
              }}
            >
              Remove
            </Button>
          )}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Platform Name</Label>
              <Select
                value={p.platformName}
                onValueChange={(v) => handleFieldChange(idx, "platformName", v as string)}
              >
                <SelectTrigger className="bg-white/5 border-white/10 h-10">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_PLATFORMS.map((plat) => (
                    <SelectItem key={plat} value={plat}>
                      {plat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Followers (Start)</Label>
              <Input
                type="number"
                name="followersStart"
                value={p.followersStart}
                onChange={(e) => handleFieldChange(idx, "followersStart", e.target.value)}
                placeholder="e.g. 1200"
              />
            </div>
            <div className="space-y-2">
              <Label>Followers (End)</Label>
              <Input
                type="number"
                name="followersEnd"
                value={p.followersEnd}
                onChange={(e) => handleFieldChange(idx, "followersEnd", e.target.value)}
                placeholder="e.g. 1500"
              />
            </div>
            <div className="space-y-2">
              <Label>Growth (%)</Label>
              <Input
                name="growth"
                placeholder="e.g. +5.2%"
                value={p.growth}
                onChange={(e) => handleFieldChange(idx, "growth", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Engagement Rate (%)</Label>
              <Input
                name="engagementRate"
                placeholder="e.g. 3.4%"
                value={p.engagementRate}
                onChange={(e) => handleFieldChange(idx, "engagementRate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Reach</Label>
              <Input
                type="number"
                name="reach"
                value={p.reach}
                onChange={(e) => handleFieldChange(idx, "reach", e.target.value)}
                placeholder="e.g. 20000"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Impressions</Label>
              <Input
                type="number"
                name="impressions"
                value={p.impressions}
                onChange={(e) => handleFieldChange(idx, "impressions", e.target.value)}
                placeholder="e.g. 50000"
              />
            </div>
          </div>
        </Card>
      ))}
      <Button type="button" onClick={addPlatform} variant="outline" className="border-white/10 mt-2">
        Add Another Platform
      </Button>
    </div>
  );
}
