"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { REPORT_TYPES, ReportType } from "@/lib/constants";
import { PlusCircle, Send, CheckCircle2, Loader2, ArrowLeft, UserPlus, Info } from "lucide-react";
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
    <Container className="py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Employee Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-base">Generate and submit performance reports for clients.</p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
              <DialogTrigger
                render={
                  <Button variant="outline" className="border-border hover:bg-muted gap-2 shadow-xs">
                    <UserPlus className="h-4 w-4 text-primary" /> Add Client
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-md bg-background border border-border shadow-2xl relative overflow-hidden p-0 gap-0">
                <div className="absolute top-0 left-0 w-full h-1.5 jisnu-gradient" />
                
                {/* Visual Banner Header */}
                <div className="bg-muted/30 px-6 py-6 border-b border-border/60 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-xs shrink-0">
                    <UserPlus className="h-6 w-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-extrabold text-foreground tracking-tight">Add New Client Account</DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                      Register a secure account for client analytics access.
                    </DialogDescription>
                  </div>
                </div>

                <form onSubmit={handleAddClient} className="flex flex-col">
                  {/* Fields Container */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="client-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company / Client Name</Label>
                      <Input
                        id="client-name"
                        placeholder="e.g., Kidz Explore Therapy"
                        required
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        className="bg-white border-border/80 h-11 focus:border-primary/50 focus:ring-primary/20 rounded-lg text-sm"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="client-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Portal Email Address</Label>
                      <Input
                        id="client-email"
                        type="email"
                        placeholder="e.g., client@exploretherapy.com"
                        required
                        value={newClientEmail}
                        onChange={(e) => setNewClientEmail(e.target.value)}
                        className="bg-white border-border/80 h-11 focus:border-primary/50 focus:ring-primary/20 rounded-lg text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="client-password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Portal Password</Label>
                        <Input
                          id="client-password"
                          type="password"
                          placeholder="••••••••"
                          required
                          value={newClientPassword}
                          onChange={(e) => setNewClientPassword(e.target.value)}
                          className="bg-white border-border/80 h-11 focus:border-primary/50 focus:ring-primary/20 rounded-lg text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="client-id" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unique Client ID</Label>
                        <Input
                          id="client-id"
                          placeholder="e.g., KIDS_EXPLORE"
                          required
                          value={newClientId}
                          onChange={(e) => setNewClientId(e.target.value)}
                          className="bg-white border-border/80 h-11 focus:border-primary/50 focus:ring-primary/20 rounded-lg text-sm"
                        />
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 flex items-start gap-2.5">
                      <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-[11px] text-primary leading-relaxed font-medium">
                        The <span className="font-bold">Client ID</span> must be a unique tag. Reports will be mapped to this ID to display them securely on the client portal.
                      </p>
                    </div>
                  </div>

                  {/* Sticky Footer */}
                  <DialogFooter className="bg-muted/40 border-t border-border/50 px-6 py-4 flex items-center justify-end gap-3 rounded-b-xl">
                    <DialogClose render={<Button type="button" variant="ghost" className="hover:bg-muted text-muted-foreground hover:text-foreground">Cancel</Button>} />
                    <Button type="submit" disabled={isAddingClient} className="jisnu-gradient px-6 h-10 text-white font-bold tracking-wide rounded-lg shadow-md shadow-primary/25 hover:opacity-95 transition-opacity">
                      {isAddingClient ? <Loader2 className="animate-spin h-4 w-4" /> : "Create Account"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <div className="jisnu-gradient px-4 py-2 rounded-lg text-white font-bold shadow-md">
              Submission Mode
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          <Card className="glass-card overflow-hidden border border-border/80 shadow-lg">
            <div className="h-1.5 jisnu-gradient w-full" />
            <CardHeader className="px-6 pt-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-foreground">Step {step}: {step === 1 ? "Configuration" : "Data Entry"}</CardTitle>
                {step > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)} className="hover:bg-muted text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                )}
              </div>
              <CardDescription className="text-muted-foreground text-sm mt-1">
                {step === 1 ? "Select the recipient and the type of report you want to generate." : "Fill in the details for the selected report."}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-4">
              {step === 1 ? (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-foreground/80">Target Client</Label>
                    <Select onValueChange={(v) => setSelectedClient(v || "")} value={selectedClient}>
                      <SelectTrigger className="h-12 bg-background border-border/80 w-full shadow-xs">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(c => <SelectItem key={c.clientId} value={c.clientId}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-foreground/80">Report Type</Label>
                    <Select onValueChange={(v) => setSelectedReportType((v as ReportType) || "")} value={selectedReportType}>
                      <SelectTrigger className="h-12 bg-background border-border/80 w-full shadow-xs">
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
            <CardFooter className="bg-muted/30 border-t border-border/50 py-5 px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-muted-foreground italic text-center sm:text-left">
                * All data will be visible to the client immediately after submission.
              </p>
              {step === 1 ? (
                <Button onClick={handleNext} className="jisnu-gradient px-8 py-6 rounded-xl shadow-lg shadow-primary/20 text-white font-semibold group w-full sm:w-auto">
                  Next Step <PlusCircle className="ml-2 h-5 w-5 group-hover:scale-105 transition-transform" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="jisnu-gradient px-8 py-6 rounded-xl shadow-lg shadow-primary/20 text-white font-semibold w-full sm:w-auto"
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
