"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { REPORT_TYPES, ReportType } from "@/lib/constants";
import { PlusCircle, Send, CheckCircle2, Loader2, ArrowLeft, UserPlus } from "lucide-react";
import { toast } from "sonner";
import Container from "@/components/ui/Container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

// Specific Report Forms
import PlatformOverviewForm from "@/components/reports/PlatformOverviewForm";
import TopPostForm from "@/components/reports/TopPostForm";
import AdCampaignForm from "@/components/reports/AdCampaignForm";
import AudienceInsightForm from "@/components/reports/AudienceInsightForm";
import CompetitorsSnapshotForm from "@/components/reports/CompetitorsSnapshotForm";
import RecommendationForm from "@/components/reports/RecommendationForm";
import SummaryForm from "@/components/reports/SummaryForm";

export default function EmployeeDashboard() {
  const { data: session } = useSession();
  const [clients, setClients] = useState<{ clientId: string; name: string }[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedReportType, setSelectedReportType] = useState<ReportType | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportData, setReportData] = useState<any>({});
  const [step, setStep] = useState(1);

  // Add Client Modal states
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPassword, setNewClientPassword] = useState("");
  const [newClientId, setNewClientId] = useState("");
  const [isAddingClient, setIsAddingClient] = useState(false);

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      } else {
        toast.error("Error", { description: "Failed to load clients." });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", { description: "Failed to fetch clients." });
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingClient(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClientName,
          email: newClientEmail,
          password: newClientPassword,
          clientId: newClientId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Success", { description: "Client created successfully!" });
        setIsAddClientOpen(false);
        setNewClientName("");
        setNewClientEmail("");
        setNewClientPassword("");
        setNewClientId("");
        fetchClients();
      } else {
        toast.error("Error", { description: data.error || "Failed to create client." });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", { description: "An unexpected error occurred." });
    } finally {
      setIsAddingClient(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && (!selectedClient || !selectedReportType)) {
      toast.error("Required", { description: "Please select a client and report type." });
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // API call to save report
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: selectedClient,
          type: selectedReportType,
          data: reportData,
          month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
        })
      });

      if (res.ok) {
        toast.success("Success", { description: "Report submitted successfully!" });
        setStep(1);
        setSelectedReportType("");
        setReportData({});
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      toast.error("Error", { description: "Failed to submit report." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderReportForm = () => {
    switch (selectedReportType) {
      case "platform_overview": return <PlatformOverviewForm onChange={setReportData} />;
      case "top_post": return <TopPostForm onChange={setReportData} />;
      case "ad_campaign": return <AdCampaignForm onChange={setReportData} />;
      case "audience_insight": return <AudienceInsightForm onChange={setReportData} />;
      case "competitors_snapshot": return <CompetitorsSnapshotForm onChange={setReportData} />;
      case "recommendation": return <RecommendationForm onChange={setReportData} />;
      case "summary": return <SummaryForm onChange={setReportData} />;
      default: return <p>Please select a report type</p>;
    }
  };

  return (
    <Container className="py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Employee Dashboard</h1>
            <p className="text-muted-foreground mt-2">Generate and submit performance reports for clients.</p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-white/10 hover:bg-white/5 backdrop-blur-sm gap-2">
                  <UserPlus className="h-4 w-4" /> Add Client
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-background border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 jisnu-gradient" />
                <DialogHeader className="pt-4">
                  <DialogTitle className="text-2xl font-bold">Add New Client</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Create a new client account so they can log in and access their reports.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddClient} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Client Name</Label>
                    <Input
                      id="client-name"
                      placeholder="e.g., Nike Inc"
                      required
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-email">Email Address</Label>
                    <Input
                      id="client-email"
                      type="email"
                      placeholder="e.g., info@nike.com"
                      required
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-password">Password</Label>
                    <Input
                      id="client-password"
                      type="password"
                      required
                      value={newClientPassword}
                      onChange={(e) => setNewClientPassword(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-id">Client ID (Unique code)</Label>
                    <Input
                      id="client-id"
                      placeholder="e.g., NIKE_ID"
                      required
                      value={newClientId}
                      onChange={(e) => setNewClientId(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <DialogFooter className="pt-4">
                    <DialogClose asChild>
                      <Button type="button" variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isAddingClient} className="jisnu-gradient px-6">
                      {isAddingClient ? <Loader2 className="animate-spin h-4 w-4" /> : "Create Client"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <div className="jisnu-gradient px-4 py-2 rounded-lg text-white font-bold shadow-lg">
              Submission Mode
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          <Card className="glass-card overflow-hidden">
            <div className="h-1 jisnu-gradient w-full" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Step {step}: {step === 1 ? "Configuration" : "Data Entry"}</CardTitle>
                {step > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                )}
              </div>
              <CardDescription>
                {step === 1 ? "Select the recipient and the type of report you want to generate." : "Fill in the details for the selected report."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {step === 1 ? (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-base">Target Client</Label>
                    <Select onValueChange={(v) => setSelectedClient(v || "")} value={selectedClient}>
                      <SelectTrigger className="h-12 bg-white/5 border-white/10">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(c => <SelectItem key={c.clientId} value={c.clientId}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base">Report Type</Label>
                    <Select onValueChange={(v) => setSelectedReportType((v as ReportType) || "")} value={selectedReportType}>
                      <SelectTrigger className="h-12 bg-white/5 border-white/10">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        {REPORT_TYPES.map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {renderReportForm()}
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-white/5 border-t border-white/5 py-4 flex justify-between">
              <p className="text-xs text-muted-foreground italic">
                * All data will be visible to the client immediately after submission.
              </p>
              {step === 1 ? (
                <Button onClick={handleNext} className="jisnu-gradient px-8 py-6 rounded-xl shadow-xl shadow-primary/20">
                  Next Step <PlusCircle className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="jisnu-gradient px-8 py-6 rounded-xl shadow-xl shadow-primary/20"
                >
                  {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : <>Submit Report <Send className="ml-2 h-5 w-5" /></>}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </Container>
  );
}
