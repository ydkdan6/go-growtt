import { useLocation } from "wouter";
import { Home, GraduationCap, TrendingUp, User, Sprout, Trophy, Settings, HelpCircle, Newspaper } from "lucide-react";
// import growttLogo/;
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "./ui/sidebar";
import { Badge } from "./ui/badge";

const mainNavItems = [
  { id: "home", label: "Home", icon: Home, path: "/dashboard" },
  { id: "learn", label: "Learn", icon: GraduationCap, path: "/learn" },
  { id: "invest", label: "Invest", icon: TrendingUp, path: "/invest" },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy, path: "/leaderboard" },
  { id: "news", label: "News & Insights", icon: Newspaper, path: "/news" },
];

const accountNavItems = [
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
  { id: "settings", label: "Settings", icon: Settings, path: "/profile" },
  { id: "help", label: "Help & Support", icon: HelpCircle, path: "/profile" },
];

interface AppSidebarProps {
  currentPage: string;
  userSeeds?: number;
}

export function AppSidebar({ currentPage, userSeeds = 120 }: AppSidebarProps) {
  const [location, setLocation] = useLocation();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <img src="/src/assets/Growtt_Icon_Primary_1770990881558.jpg" alt="Growtt" className="w-10 h-10 rounded-full object-cover" />
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
                const isActive = location === item.path || 
                  (item.path === "/" && location === "/") ||
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
      
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{userSeeds} Seeds</p>
            <p className="text-xs text-muted-foreground">Keep learning to earn more</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
