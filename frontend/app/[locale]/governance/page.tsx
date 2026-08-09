"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Vote, Clock, CheckCircle, AlertCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const FOCUS_VISIBLE =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const proposals = [
  {
    id: "1",
    title: "Adjust Stability Fee",
    description:
      "Proposal to adjust the stability fee from 2.5% to 3.0% to better align with current market conditions and maintain protocol solvency.",
    status: "active",
    deadline: "2026-09-15",
    votesFor: 1250000,
    votesAgainst: 340000,
  },
  {
    id: "2",
    title: "Add USDC Collateral Type",
    description:
      "Proposal to introduce USDC as a new collateral type with a 90% liquidation ratio and 1.5% stability fee.",
    status: "active",
    deadline: "2026-09-20",
    votesFor: 980000,
    votesAgainst: 120000,
  },
  {
    id: "3",
    title: "Treasury Diversification Strategy",
    description:
      "Proposal to allocate 15% of the treasury to a diversified portfolio of blue-chip DeFi tokens to generate additional yield.",
    status: "pending",
    deadline: "2026-10-01",
    votesFor: 0,
    votesAgainst: 0,
  },
  {
    id: "4",
    title: "Protocol Fee Reduction",
    description:
      "Reduce the protocol fee from 0.5% to 0.3% to encourage higher trading volume and attract new users to the platform.",
    status: "executed",
    deadline: "2026-08-01",
    votesFor: 2100000,
    votesAgainst: 450000,
  },
  {
    id: "5",
    title: "Emergency Fund Allocation",
    description:
      "Allocate 5% of protocol revenue to an emergency fund managed by a multi-sig wallet for rapid response to security incidents.",
    status: "defeated",
    deadline: "2026-07-15",
    votesFor: 600000,
    votesAgainst: 1800000,
  },
  {
    id: "6",
    title: "Upgrade Oracle Provider",
    description:
      "Upgrade the price oracle provider from the current solution to a decentralized oracle network for improved reliability and tamper-resistance.",
    status: "active",
    deadline: "2026-09-28",
    votesFor: 1500000,
    votesAgainst: 210000,
  },
];

const statusConfig: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  active: {
    label: "Active",
    icon: <Vote className="w-4 h-4" />,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  pending: {
    label: "Pending",
    icon: <Clock className="w-4 h-4" />,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  executed: {
    label: "Executed",
    icon: <CheckCircle className="w-4 h-4" />,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  defeated: {
    label: "Defeated",
    icon: <AlertCircle className="w-4 h-4" />,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
};

function formatVotes(votes: number): string {
  if (votes >= 1_000_000) {
    return (votes / 1_000_000).toFixed(1) + "M";
  }
  if (votes >= 1_000) {
    return (votes / 1_000).toFixed(0) + "K";
  }
  return votes.toString();
}

export default function GovernancePage() {
  const t = useTranslations("GovernancePage");

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Vote className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Governance
          </h1>
        </div>
        <p className="text-muted-foreground ml-[52px]">
          Participate in protocol governance by voting on active proposals.
          Your voting power is proportional to your stake.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Active Proposals", value: "3", color: "text-green-500" },
          { label: "Total Voters", value: "1,247", color: "text-foreground" },
          { label: "Total Votes Cast", value: "9.8M", color: "text-foreground" },
          { label: "Your Voting Power", value: "0", color: "text-muted-foreground" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-2xl p-4"
          >
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Proposals Grid */}
      <h2 className="text-xl font-bold tracking-tight mb-6">Active Proposals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proposals.map((proposal) => {
          const status = statusConfig[proposal.status] || statusConfig.pending;
          const totalVotes = proposal.votesFor + proposal.votesAgainst;
          const forPercentage =
            totalVotes > 0
              ? Math.round((proposal.votesFor / totalVotes) * 100)
              : 0;

          return (
            <Card
              key={proposal.id}
              className="hover:border-primary/50 transition-colors group flex flex-col"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}
                  >
                    {status.icon}
                    {status.label}
                  </div>
                  {proposal.status === "active" && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {proposal.deadline}
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg">{proposal.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {proposal.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {/* Voting Bar */}
                {proposal.status === "active" && (
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{
                          width: `${forPercentage}%`,
                        }}
                      />
                      <div
                        className="h-full bg-red-500 transition-all"
                        style={{
                          width: `${100 - forPercentage}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="text-green-500 font-medium">
                        For: {formatVotes(proposal.votesFor)}
                      </span>
                      <span className="text-red-500 font-medium">
                        Against: {formatVotes(proposal.votesAgainst)}
                      </span>
                    </div>
                  </div>
                )}
                {proposal.status === "pending" && (
                  <p className="text-sm text-muted-foreground">
                    Voting opens on {proposal.deadline}
                  </p>
                )}
                {(proposal.status === "executed" || proposal.status === "defeated") && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">
                      For: {formatVotes(proposal.votesFor)}
                    </span>
                    <span className="text-red-500 font-medium">
                      Against: {formatVotes(proposal.votesAgainst)}
                    </span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-3 border-t border-border">
                {proposal.status === "active" ? (
                  <Button className={`w-full ${FOCUS_VISIBLE}`}>
                    <Vote className="w-4 h-4 mr-2" />
                    Cast Vote
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className={`w-full ${FOCUS_VISIBLE}`}
                    disabled
                  >
                    {proposal.status === "executed"
                      ? "Executed"
                      : proposal.status === "defeated"
                        ? "Defeated"
                        : "Voting Not Open"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Empty State for when no proposals match */}
      {proposals.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Vote className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-2">No Active Proposals</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            There are currently no active proposals for voting. Check back later
            for new governance proposals.
          </p>
        </div>
      )}
    </div>
  );
}
