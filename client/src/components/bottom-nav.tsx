import { useLocation } from "wouter";
import { Home, GraduationCap, TrendingUp, User, Newspaper } from "lucide-react";

interface BottomNavProps {
  currentPage: "home" | "learn" | "invest" | "profile" | "news";
}

const navItems = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "learn", label: "Learn", icon: GraduationCap, path: "/learn" },
  { id: "invest", label: "Invest", icon: TrendingUp, path: "/invest" },
  { id: "news", label: "News", icon: Newspaper, path: "/news" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
];

export function BottomNav({ currentPage }: BottomNavProps) {
  const [, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t lg:hidden">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setLocation(item.path)}
                className={`flex flex-col items-center gap-1 min-w-[64px] py-2 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
                data-testid={`nav-${item.id}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
