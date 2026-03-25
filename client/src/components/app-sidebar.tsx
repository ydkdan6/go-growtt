import { useLocation } from "wouter";
import {
  Home, GraduationCap, TrendingUp, User, Sprout, Trophy,
  Settings, HelpCircle, Newspaper, LogOut,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter,
} from "./ui/sidebar";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useUserDetail } from "@/hooks/general/useUserDetails";

const mainNavItems = [
  { id: "home",        label: "Home",           icon: Home,          path: "/dashboard" },
  { id: "learn",       label: "Learn",          icon: GraduationCap, path: "/learn"     },
  { id: "invest",      label: "Invest",         icon: TrendingUp,    path: "/invest"    },
  { id: "leaderboard", label: "Leaderboard",    icon: Trophy,        path: "/leaderboard" },
  { id: "news",        label: "News & Insights", icon: Newspaper,    path: "/news"      },
];

const accountNavItems = [
  { id: "profile",  label: "Profile",       icon: User,        path: "/profile" },
  { id: "settings", label: "Settings",      icon: Settings,    path: "/profile" },
  { id: "help",     label: "Help & Support", icon: HelpCircle, path: "/profile" },
];

interface AppSidebarProps {
  currentPage: string;
  userSeeds?: number; // kept for backwards compat — overridden by API if available
}

export function AppSidebar({ currentPage }: AppSidebarProps) {
  const [location, setLocation] = useLocation();
  const { data: user } = useUserDetail();

  // ── Seeds — use wallet_balance until a dedicated seeds field is added to API ──
  // Swap `wallet_balance` → `seeds` (or whatever field name) when backend adds it
  const seeds = Number(user?.wallet_balance) || 0;

  // ── Display name ──────────────────────────────────────────────────────────
  const displayName =
    user?.full_name ||
    (user?.first_name ? `${user.first_name} ${user.last_name}`.trim() : null) ||
    user?.username ||
    "My Account";

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    sessionStorage.removeItem("signup_email");
    // Hard redirect to clear all React Query cache + component state
    window.location.href = "/";
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <img
            src="/Growtt_Icon_Primary_1770990881558.jpg"
            alt="Growtt"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h1 className="font-bold text-lg">Growtt</h1>
            <p className="text-xs text-muted-foreground">Learn First, Invest Smart</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive =
                  location === item.path ||
                  (item.path !== "/" && location.startsWith(item.path));
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setLocation(item.path)}
                      isActive={isActive}
                      data-testid={`sidebar-${item.id}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountNavItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setLocation(item.path)}
                      isActive={isActive}
                      data-testid={`sidebar-${item.id}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t space-y-3">
        {/* ── Seeds / wallet balance ── */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sprout className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{seeds} Seeds</p>
            <p className="text-xs text-muted-foreground truncate">
              {displayName}
            </p>
          </div>
        </div>

        {/* ── Logout with confirmation dialog ── */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              data-testid="sidebar-logout"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Log out of Growtt?</AlertDialogTitle>
              <AlertDialogDescription>
                You'll need to sign in again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-testid="sidebar-logout-confirm"
              >
                Log Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  );
}