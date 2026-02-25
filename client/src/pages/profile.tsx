import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ThemeToggle } from "../components/theme-toggle";
import { BottomNav } from "../components/bottom-nav";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { 
  Sprout,
  ChevronRight,
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Gift,
  CreditCard,
  FileText,
  Users,
  Star
} from "lucide-react";

const menuItems = [
  { icon: CreditCard, label: "Payment Methods", badge: null },
  { icon: FileText, label: "Transaction History", badge: null },
  { icon: Users, label: "Referrals", badge: "50 seeds" },
  { icon: Bell, label: "Notifications", badge: null },
  { icon: Shield, label: "Security", badge: null },
  { icon: HelpCircle, label: "Help & Support", badge: null },
  { icon: Settings, label: "Settings", badge: null },
];

export default function Profile() {
  const userSeeds = 120;
  const level = "Beginner";
  const progress = 12;

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">Profile</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-5 lg:pt-6 space-y-6">
        {/* Profile Card */}
        <Card className="border">
          <CardContent className="p-5">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                  GU
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-bold text-lg">Guest User</h2>
                <p className="text-sm text-muted-foreground">guest@example.com</p>
                <Badge variant="secondary" className="mt-1 gap-1">
                  <Star className="w-3 h-3 text-primary" />
                  {level}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" data-testid="button-edit-profile">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Seeds & Progress */}
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{userSeeds} Seeds</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Level 1
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress to Level 2</span>
                  <span className="text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Earn 80 more seeds to reach Level 2
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Card */}
        <Card className="border bg-gradient-to-r from-accent/20 to-accent/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Gift className="w-6 h-6 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Daily Rewards</p>
              <p className="text-xs text-muted-foreground">Claim your daily bonus seeds</p>
            </div>
            <Button size="sm" data-testid="button-claim-reward">
              Claim
            </Button>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <section>
          <Card className="border">
            <CardContent className="p-0">
              {menuItems.map((item, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center gap-4 p-4 hover-elevate cursor-pointer ${
                    idx !== menuItems.length - 1 ? 'border-b' : ''
                  }`}
                  data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="flex-1 font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Sprout className="w-3 h-3" />
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Logout */}
        <Button variant="outline" className="w-full text-destructive border-destructive/30" data-testid="button-logout">
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </main>

      <BottomNav currentPage="profile" />
    </div>
  );
}
