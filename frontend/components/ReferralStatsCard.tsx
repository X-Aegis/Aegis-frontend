"use client";

import { Users, TrendingUp, DollarSign, Wallet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const MOCK_REFERRALS = [
  { id: "1", user: "0x742...4f2", date: "2024-03-01", status: "Active", bonus: "$12.50" },
  { id: "2", user: "0x12b...9a1", date: "2024-03-03", status: "Active", bonus: "$8.20" },
  { id: "3", user: "0x98c...3d5", date: "2024-03-05", status: "Pending", bonus: "$0.00" },
];

export function ReferralStatsCard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Earnings</p>
            <CardTitle className="text-2xl font-black text-green-500">$20.70</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span>+14% from last week</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Referrals</p>
            <CardTitle className="text-2xl font-black">2</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3 text-primary" />
              <span>3 total invites sent</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Recent Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_REFERRALS.map((ref) => (
              <div key={ref.id} className="flex justify-between items-center pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold font-mono">{ref.user}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{ref.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{ref.bonus}</p>
                  <p className={`text-[10px] uppercase font-bold ${ref.status === 'Active' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {ref.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
