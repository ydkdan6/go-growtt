import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { BottomNav } from "@/components/bottom-nav";
import {
  ArrowLeft,
  Sparkles,
  Send,
  TrendingUp,
  BookOpen,
  Shield,
  Lightbulb,
  Bot,
  User,
} from "lucide-react";
import growttLogo from "@assets/Growtt_Icon_Primary_1770990881558.jpg";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

const suggestedQuestions = [
  { icon: TrendingUp, text: "How do I start investing in stocks?" },
  { icon: BookOpen, text: "What is diversification?" },
  { icon: Shield, text: "How much should I invest as a beginner?" },
  { icon: Lightbulb, text: "What's the difference between stocks and bonds?" },
];

const aiResponses: Record<string, string> = {
  "How do I start investing in stocks?": "Great question! Here's a simple roadmap to start investing in stocks:\n\n1. **Learn the basics** — Complete the Stocks module on Growtt to understand how the market works.\n\n2. **Set a budget** — Only invest money you won't need for at least 3-5 years. A good starting point is ₦5,000 - ₦10,000.\n\n3. **Pick your approach** — You can buy individual stocks like DANGCEM or GTCO, or invest in a diversified fund.\n\n4. **Start small** — You don't need a lot to begin. Consistency matters more than the amount.\n\n5. **Stay patient** — The market goes up and down. Long-term investors tend to do best.\n\nWant me to explain any of these steps in more detail?",
  "What is diversification?": "Diversification is spreading your investments across different assets to reduce risk. Think of it like this:\n\n**Don't put all your eggs in one basket.**\n\nInstead of investing all your money in one stock, you spread it across:\n\n• **Different asset types** — Stocks, bonds, real estate, crypto\n• **Different sectors** — Banking, tech, oil & gas, consumer goods\n• **Different regions** — Nigerian stocks, international stocks\n\n**Why it matters:**\nIf one investment drops in value, your other investments can help balance out the loss. For example, when stocks fall, bonds often hold steady.\n\nA well-diversified portfolio with ₦100,000 might look like:\n• ₦40,000 in stocks\n• ₦30,000 in bonds\n• ₦20,000 in real estate\n• ₦10,000 in savings\n\nWould you like to learn more about building a diversified portfolio?",
  "How much should I invest as a beginner?": "As a beginner, here's a smart approach to deciding how much to invest:\n\n**The 50/30/20 Rule:**\n• 50% of income → Needs (rent, food, transport)\n• 30% of income → Wants (entertainment, dining out)\n• 20% of income → Savings & Investments\n\n**Start with what you can afford:**\n• Minimum: ₦5,000/month is a great start\n• Comfortable: ₦10,000 - ₦25,000/month\n• Aggressive: 20%+ of your monthly income\n\n**Key rules:**\n1. Build an emergency fund first (3-6 months of expenses)\n2. Never invest money you'll need within 1 year\n3. Start small and increase gradually\n4. Consistency beats amount — ₦5,000 every month is better than ₦60,000 once a year\n\nOn Growtt, you can start investing with as little as ₦1,000. Would you like to explore investment options?",
  "What's the difference between stocks and bonds?": "Great question! Here's a simple breakdown:\n\n**Stocks (Equities):**\n• You own a tiny piece of a company\n• Higher potential returns (8-15% annually)\n• Higher risk — prices can swing a lot\n• You earn through price growth + dividends\n• Example: Buying DANGCEM shares means you own part of Dangote Cement\n\n**Bonds (Fixed Income):**\n• You lend money to a company or government\n• Lower but steadier returns (5-10% annually)\n• Lower risk — you get regular interest payments\n• You earn through fixed interest payments\n• Example: FGN Bonds mean you're lending to the Nigerian government\n\n**Think of it this way:**\n• Stocks = Being a business owner (more reward, more risk)\n• Bonds = Being a lender (steady income, less risk)\n\n**Which should you choose?**\nMost experts recommend a mix of both. Younger investors can lean more towards stocks, while those closer to retirement might prefer bonds.\n\nWould you like to explore stocks or bonds on Growtt?",
};

const defaultResponse = "That's a great question! I'm here to help you learn about investing. While I'm still learning to answer every question perfectly, here are some things I can help with:\n\n• Understanding investment basics\n• Explaining different asset types\n• Budgeting and savings tips\n• Portfolio building strategies\n\nTry asking me about stocks, bonds, diversification, or how to get started with investing!";

export default function GrowttAI() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = aiResponses[text.trim()] || defaultResponse;
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "ai", text: response };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8 flex flex-col">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-semibold text-sm">Growtt AI</span>
              <p className="text-xs text-green-600 dark:text-green-400">Online</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-lg lg:max-w-2xl mx-auto w-full px-4 lg:px-6 pt-5 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-5">
              <img src={growttLogo} alt="Growtt" className="w-14 h-14 rounded-full object-cover" />
            </div>
            <h2 className="text-xl font-bold mb-2">Growtt AI</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Your personal investment assistant. Ask me anything about investing, finance, and growing your wealth.
            </p>

            <div className="w-full space-y-2">
              <p className="text-xs text-muted-foreground font-medium mb-2">Suggested questions</p>
              {suggestedQuestions.map((q, i) => (
                <Card
                  key={i}
                  className="border hover-elevate cursor-pointer text-left"
                  onClick={() => sendMessage(q.text)}
                  data-testid={`suggested-question-${i}`}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <q.icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm flex-1">{q.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 pb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  }`}
                  data-testid={`message-${msg.role}-${msg.id}`}
                >
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>
                      {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={j}>{part.slice(2, -2)}</strong>;
                        }
                        return <span key={j}>{part}</span>;
                      })}
                      {i < msg.text.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <div className="sticky bottom-16 lg:bottom-0 bg-background border-t">
        <div className="max-w-lg lg:max-w-2xl mx-auto px-4 lg:px-6 py-3">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Ask Growtt AI anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 pr-12"
                data-testid="input-ai-message"
              />
            </div>
            <Button
              size="icon"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Growtt AI provides educational info only, not financial advice
          </p>
        </div>
      </div>

      <BottomNav currentPage="home" />
    </div>
  );
}
