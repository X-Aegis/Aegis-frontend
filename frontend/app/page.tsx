"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "withdraw">("dashboard");

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navigation / Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="text-primary-foreground w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">X-Aegis</span>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="ghost">Dashboard</Button>
             <Button variant="ghost">Vaults</Button>
             <Button>Connect Wallet</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 flex flex-col items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome to X-Aegis</CardTitle>
            <CardDescription>Volatility Shield for Weak Currencies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Vaults</label>
              <Input placeholder="Enter vault name..." />
            </div>
            <Button className="w-full">Get Started</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
