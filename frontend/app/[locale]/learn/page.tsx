"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ChevronLeft,
  BookOpen,
  TrendingUp,
  Shield,
  BarChart3,
  GraduationCap,
  CheckCircle,
  Play,
  RefreshCw,
  ArrowRight,
  Info,
  AlertTriangle,
  PieChart,
  Activity,
  Brain,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ─── Module data ─────────────────────────────────────────────────────────────

interface Module {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
  sections: Section[];
  quiz: QuizQuestion[];
}

interface Section {
  title: string;
  content: string;
  type: "text" | "example" | "tip" | "warning";
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const VOLATILITY_MODULE: Module = {
  id: "volatility",
  icon: <Activity className="w-5 h-5" />,
  title: "Understanding Volatility",
  description: "Learn what market volatility is, how it's measured, and why it matters for your investments.",
  duration: "10 min",
  sections: [
    {
      title: "What is Volatility?",
      type: "text",
      content:
        "Volatility is a statistical measure of the dispersion of returns for a given security or market index. In simple terms, it measures how much the price of an asset fluctuates over time. High volatility means the price can change dramatically over a short period in either direction, while low volatility means the price tends to move more steadily.",
    },
    {
      title: "Understanding Standard Deviation",
      type: "text",
      content:
        "Standard deviation is the most common measure of volatility. It tells you how much an asset's price deviates from its average price over a given period. A higher standard deviation indicates greater price variability and therefore higher risk. For example, if a stock has an average return of 10% with a standard deviation of 5%, its returns typically fall between 5% and 15%.",
    },
    {
      title: "Volatility During Market Events",
      type: "example",
      content:
        "During the 2020 market crash, the VIX (Volatility Index) spiked to over 80 — its highest level ever. This extreme volatility meant that stock prices were moving 5-10% daily, compared to the typical 1% daily move. For crypto markets, volatility can be even more extreme, with Bitcoin sometimes moving 20%+ in a single day.",
    },
    {
      title: "Why Volatility Matters",
      type: "tip",
      content:
        "Volatility isn't inherently bad. While high volatility means higher risk, it also means greater potential for returns. The key is to match your investment strategy with your risk tolerance. If you're saving for retirement in 30 years, short-term volatility matters less than if you're saving for a house down payment next year.",
    },
    {
      title: "Common Volatility Misconceptions",
      type: "warning",
      content:
        "Many investors confuse volatility with loss. A volatile asset that goes down 30% and then up 40% has high volatility but may still be profitable. Similarly, a steady decline of 1% per month is low volatility but results in a significant loss. Always consider volatility in the context of overall returns.",
    },
  ],
  quiz: [
    {
      question: "What does high volatility indicate about an asset?",
      options: [
        "The asset is guaranteed to lose value",
        "The asset's price can change dramatically in either direction",
        "The asset is low risk",
        "The asset has a fixed price",
      ],
      correct: 1,
      explanation:
        "High volatility means the price can change dramatically over a short period in either direction — up or down.",
    },
    {
      question: "What is the most common measure of volatility?",
      options: ["Median", "Mean", "Standard deviation", "Correlation"],
      correct: 2,
      explanation:
        "Standard deviation is the most common measure of volatility, indicating how much an asset's price deviates from its average.",
    },
    {
      question: "Is high volatility always bad for investors?",
      options: [
        "Yes, it always means losing money",
        "No, it also means greater potential for returns",
        "Yes, it should always be avoided",
        "No, it means guaranteed profits",
      ],
      correct: 1,
      explanation:
        "High volatility means higher risk but also greater potential for returns. It's not inherently bad — it depends on your investment strategy and timeline.",
    },
  ],
};

const HEDGING_MODULE: Module = {
  id: "hedging",
  icon: <Shield className="w-5 h-5" />,
  title: "Hedging Strategies",
  description: "Discover how hedging can protect your portfolio from adverse market movements and reduce downside risk.",
  duration: "12 min",
  sections: [
    {
      title: "What is Hedging?",
      type: "text",
      content:
        "Hedging is a risk management strategy used to offset potential losses in an investment by taking an opposite position in a related asset. Think of it as insurance for your portfolio — you pay a premium (the cost of the hedge) to protect against downside risk. While hedging can reduce losses, it also limits potential gains.",
    },
    {
      title: "Common Hedging Instruments",
      type: "text",
      content:
        "The most common hedging instruments include: Options (puts and calls), Futures contracts, Inverse ETFs, and Currency forwards. In the crypto space, common hedging tools include options on exchanges like Deribit, futures on Binance, and stablecoins as a hedge against market volatility.",
    },
    {
      title: "Practical Example: Protecting a Portfolio",
      type: "example",
      content:
        "Suppose you own $10,000 worth of ETH and fear a short-term price drop. You could buy a put option with a strike price 10% below the current market price. If ETH drops 20%, your put option gains value, offsetting part of your ETH position loss. The cost is the option premium, which is your maximum loss if ETH doesn't drop.",
    },
    {
      title: "Hedging Best Practices",
      type: "tip",
      content:
        "Never hedge your entire portfolio — it's costly and limits upside. Instead, hedge specific risks you've identified. Use a hedging ratio that matches your risk tolerance. Review your hedges regularly as market conditions change. And remember: the goal of hedging is risk reduction, not profit generation.",
    },
    {
      title: "Hedging Risks & Limitations",
      type: "warning",
      content:
        "Hedging is not perfect. Basis risk occurs when the hedge instrument doesn't perfectly correlate with the asset being hedged. There's also opportunity cost — if the market moves in your favor, the hedge reduces your gains. Additionally, options and futures have expiration dates, requiring active management.",
    },
  ],
  quiz: [
    {
      question: "What is the primary purpose of hedging?",
      options: [
        "To maximize profits",
        "To reduce risk and offset potential losses",
        "To increase portfolio volatility",
        "To guarantee investment returns",
      ],
      correct: 1,
      explanation:
        "Hedging is primarily a risk management tool used to offset potential losses, similar to buying insurance for your portfolio.",
    },
    {
      question: "Which of the following is a common hedging instrument?",
      options: ["Savings account", "Put option", "Checking account", "Credit card"],
      correct: 1,
      explanation:
        "Put options, futures contracts, and inverse ETFs are all common hedging instruments that allow investors to protect against downside risk.",
    },
    {
      question: "What is a downside of hedging?",
      options: [
        "It always costs nothing",
        "It guarantees profits",
        "It can limit potential gains if the market moves favorably",
        "It eliminates all risk",
      ],
      correct: 2,
      explanation:
        "Hedging can limit potential gains because if the market moves in your favor, the hedge position may reduce your overall profit.",
    },
  ],
};

const STABLECOIN_MODULE: Module = {
  id: "stablecoins",
  icon: <PieChart className="w-5 h-5" />,
  title: "Stablecoins & DeFi Hedging",
  description: "Explore how stablecoins and decentralized finance protocols provide new ways to manage volatility.",
  duration: "8 min",
  sections: [
    {
      title: "Stablecoins as a Hedge",
      type: "text",
      content:
        "Stablecoins are cryptocurrencies designed to maintain a stable value relative to a reference asset, typically the US dollar. They serve as a natural hedge in crypto portfolios — when market volatility increases, investors can move funds into stablecoins to preserve capital without exiting the crypto ecosystem entirely.",
    },
    {
      title: "X-Aegis Volatility Shield",
      type: "text",
      content:
        "X-Aegis provides automated volatility protection using Soroban smart contracts. The protocol monitors market volatility in real-time and can automatically adjust positions to protect against sudden price movements. This includes rebalancing between volatile assets and stablecoins based on predefined risk thresholds.",
    },
    {
      title: "DeFi Hedging Strategies",
      type: "example",
      content:
        "DeFi protocols offer unique hedging opportunities: Yield farming can offset volatility through regular returns; options protocols like Opyn or Lyra allow crypto-native options trading; and automated vaults can dynamically hedge based on market conditions. X-Aegis's vault system uses similar principles, automatically adjusting allocations based on volatility metrics.",
    },
    {
      title: "Start Small, Learn Often",
      type: "tip",
      content:
        "The best way to learn about hedging is to start with small positions. Use X-Aegis's simulate feature to test strategies without risking real funds. Monitor your hedges regularly and adjust as you learn. Remember: even professional hedgers are constantly learning and refining their strategies.",
    },
  ],
  quiz: [
    {
      question: "What is the primary benefit of stablecoins in a volatile market?",
      options: [
        "They always increase in value",
        "They preserve capital while staying in the crypto ecosystem",
        "They eliminate all investment risk",
        "They provide guaranteed returns",
      ],
      correct: 1,
      explanation:
        "Stablecoins maintain a stable value, allowing investors to preserve capital during volatile periods without exiting the crypto ecosystem.",
    },
    {
      question: "What does X-Aegis use to provide automated volatility protection?",
      options: ["Centralized servers", "Soroban smart contracts", "Manual trading", "Email alerts"],
      correct: 1,
      explanation:
        "X-Aegis uses Soroban smart contracts on the Stellar network to provide automated, decentralized volatility protection.",
    },
  ],
};

const ALL_MODULES: Module[] = [VOLATILITY_MODULE, HEDGING_MODULE, STABLECOIN_MODULE];

// ─── Quiz Component ──────────────────────────────────────────────────────────

function QuizSection({ quiz, onComplete }: { quiz: QuizQuestion[]; onComplete: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = quiz[currentQuestion];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === q.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion((i) => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setFinished(true);
      onComplete();
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <Card className="border-border/60">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Quiz Complete!</h3>
          <p className="text-muted-foreground">
            You scored {score} out of {quiz.length}
          </p>
          {score === quiz.length ? (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Perfect score! Excellent understanding!</p>
          ) : score >= quiz.length / 2 ? (
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Good effort! Review the material to improve.</p>
          ) : (
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">Keep studying and try again!</p>
          )}
          <Button variant="outline" onClick={handleRestart} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Retry Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {currentQuestion + 1} of {quiz.length}
        </span>
        <span>
          Score: {score}/{currentQuestion}
        </span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 rounded-full"
          style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
        />
      </div>
      <p className="text-base font-semibold">{q.question}</p>
      <div className="space-y-2.5">
        {q.options.map((opt, i) => {
          let variant: "default" | "outline" | "secondary" = "outline";
          if (showResult) {
            if (i === q.correct) variant = "default";
            else if (i === selectedAnswer) variant = "secondary";
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={showResult}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                variant === "default"
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : variant === "secondary"
                  ? "border-destructive bg-destructive/10 text-destructive font-medium"
                  : "border-border hover:border-primary/50 hover:bg-accent"
              } ${showResult ? "cursor-default" : "cursor-pointer"}`}
            >
              <span className="font-mono mr-2 opacity-50">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div className={`p-4 rounded-lg text-sm ${selectedAnswer === q.correct ? "bg-green-500/10 border border-green-500/20" : "bg-amber-500/10 border border-amber-500/20"}`}>
          <p className="font-semibold mb-1">
            {selectedAnswer === q.correct ? "✓ Correct!" : "✗ Incorrect"}
          </p>
          <p className="text-muted-foreground">{q.explanation}</p>
        </div>
      )}
      {showResult && (
        <Button onClick={handleNext} className="w-full gap-2">
          {currentQuestion < quiz.length - 1 ? "Next Question" : "See Results"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

// ─── Module Detail View ──────────────────────────────────────────────────────

function ModuleDetail({ module, onBack }: { module: Module; onBack: () => void }) {
  const [activeSection, setActiveSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [showQuiz, setShowQuiz] = useState(false);

  const section = module.sections[activeSection];
  const progress = Math.round((completedSections.size / module.sections.length) * 100);

  const markComplete = () => {
    setCompletedSections((prev) => {
      const next = new Set(prev);
      next.add(activeSection);
      return next;
    });
    if (activeSection < module.sections.length - 1) {
      setActiveSection((i) => i + 1);
    }
  };

  const typeStyles: Record<string, string> = {
    text: "border-l-4 border-primary/30 pl-4",
    example: "bg-muted/50 rounded-lg p-4 border border-border/50",
    tip: "bg-blue-500/5 rounded-lg p-4 border border-blue-500/20",
    warning: "bg-amber-500/5 rounded-lg p-4 border border-amber-500/20",
  };

  const typeIcons: Record<string, React.ReactNode> = {
    text: null,
    example: <Play className="w-4 h-4 text-primary" />,
    tip: <Info className="w-4 h-4 text-blue-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to modules
      </button>

      {/* Module header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            {module.icon}
          </div>
          <h2 className="text-xl font-bold">{module.title}</h2>
        </div>
        <p className="text-sm text-muted-foreground">{module.description}</p>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Section navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {module.sections.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveSection(i)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              i === activeSection
                ? "bg-primary text-primary-foreground"
                : completedSections.has(i)
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {completedSections.has(i) && "✓ "}
            {s.title}
          </button>
        ))}
      </div>

      {/* Section content */}
      {!showQuiz && (
        <div className={`space-y-4 ${typeStyles[section.type] || ""}`}>
          <div className="flex items-center gap-2">
            {typeIcons[section.type]}
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              {section.type === "text" ? "Lesson" : section.type === "example" ? "Example" : section.type === "tip" ? "Tip" : "Warning"}
            </h3>
          </div>
          <p className="text-sm leading-relaxed">{section.content}</p>
          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={markComplete} className="gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              {activeSection < module.sections.length - 1 ? "Mark Complete & Continue" : "Complete Module"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (activeSection < module.sections.length - 1) setActiveSection((i) => i + 1);
              }}
              disabled={activeSection >= module.sections.length - 1}
            >
              Skip
            </Button>
          </div>
        </div>
      )}

      {/* Quiz section */}
      {activeSection >= module.sections.length - 1 && completedSections.size >= module.sections.length && !showQuiz && (
        <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 text-center space-y-3">
          <GraduationCap className="w-10 h-10 text-primary mx-auto" />
          <h3 className="font-bold text-lg">Ready for the Quiz?</h3>
          <p className="text-sm text-muted-foreground">Test your knowledge of {module.title.toLowerCase()}.</p>
          <Button onClick={() => setShowQuiz(true)} className="gap-2">
            <Brain className="w-4 h-4" /> Start Quiz
          </Button>
        </div>
      )}

      {showQuiz && (
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            Knowledge Check
          </h3>
          <QuizSection quiz={module.quiz} onComplete={() => {}} />
        </div>
      )}
    </div>
  );
}

// ─── Module Card ─────────────────────────────────────────────────────────────

function ModuleCard({ module, onClick }: { module: Module; onClick: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-border/60 hover:border-primary/30 transition-all cursor-pointer group" onClick={onClick}>
      <CardHeader>
        <div className="flex items-center justify-between mb-1">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
            {module.icon}
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{module.duration}</span>
        </div>
        <CardTitle className="text-lg mt-3">{module.title}</CardTitle>
        <CardDescription>{module.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1 text-sm text-primary font-medium">
          <Play className="w-3.5 h-3.5" /> Start Learning
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LearnPage() {
  const t = useTranslations("LearnPage");
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const currentModule = ALL_MODULES.find((m) => m.id === activeModule);

  if (currentModule) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-30">
          <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="text-primary w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">{t("title")}</span>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 sm:px-6 py-8 flex-grow max-w-3xl">
          <ModuleDetail module={currentModule} onBack={() => setActiveModule(null)} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1 p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Back to dashboard"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Dashboard</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="text-primary w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">{t("title")}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-grow">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-primary" aria-hidden="true" />
            {t("heading")}
          </h1>
          <p className="text-muted-foreground max-w-2xl">{t("subheading")}</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Modules", value: ALL_MODULES.length, icon: <BookOpen className="w-4 h-4" /> },
            { label: "Lessons", value: ALL_MODULES.reduce((a, m) => a + m.sections.length, 0), icon: <Play className="w-4 h-4" /> },
            { label: "Quiz Questions", value: ALL_MODULES.reduce((a, m) => a + m.quiz.length, 0), icon: <Brain className="w-4 h-4" /> },
            { label: "Total Duration", value: "30 min", icon: <BarChart3 className="w-4 h-4" /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
              <div className="flex justify-center mb-2 text-primary">{icon}</div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Learning modules grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_MODULES.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onClick={() => setActiveModule(module.id)}
            />
          ))}
        </div>

        {/* Info section */}
        <Card className="mt-8 border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="h-4 w-4 text-primary" aria-hidden="true" />
              Why Learn About Volatility?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Understanding volatility is essential for any investor. The X-Aegis protocol is built on
              the principle that informed investors make better decisions. Our educational modules are
              designed to help you understand:
            </p>
            <ul className="space-y-2">
              {[
                "How market volatility affects your portfolio",
                "Strategies to protect against downside risk",
                "How X-Aegis's smart contracts automate hedging",
                "Best practices for long-term wealth preservation",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}