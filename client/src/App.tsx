import { Switch, Route, useLocation } from "wouter";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Course from "@/pages/course";
import Learn from "@/pages/learn";
import Invest from "@/pages/invest";
import AssetListing from "@/pages/asset-listing";
import Profile from "@/pages/profile";
import Leaderboard from "@/pages/leaderboard";
import News from "@/pages/news";
import Books from "@/pages/books";
import GrowttAI from "@/pages/growtt-ai";

// Auth Import
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Verify from "./pages/Auth/Verify";

//Onboarding Imports
import OnboardingInitial from "./pages/Onboarding/Onboarding";
import OnboardingStep1 from "./pages/Onboarding/OnboardingStep1";
import OnboardingStep2 from "./pages/Onboarding/OnboardingStep2";
import OnboardingStep3 from "./pages/Onboarding/OnboardingStep3";
import OnboardingStep4 from "./pages/Onboarding/OnboardingStep4";
import OnboardingStep5 from "./pages/Onboarding/OnboardingStep5";
import OnboardingStep6 from "./pages/Onboarding/OnboardingStep6";
import OnboardingStep7 from "./pages/Onboarding/OnboardingStep7";
import OnboardingStep8 from "./pages/Onboarding/OnboardingStep8";
import OnboardingStep9 from "./pages/Onboarding/OnboardingStep9";
import OnboardingStep10 from "./pages/Onboarding/OnboardingStep10";
import OnboardingStep11 from "./pages/Onboarding/OnboardingStep11";
import OnboardingStep12 from "./pages/Onboarding/OnboardingStep12";
import OnboardingStep13 from "./pages/Onboarding/OnboardingStep13";

function Router() {
  return (
    <Switch>
      {/* Onboarding Page Routes  */}
      <Route path="/" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/verify" component={Verify} />
      <Route path="/onboarding" component={OnboardingInitial} />
      <Route path="/Onboarding/step1" component={OnboardingStep1} />
      <Route path="/Onboarding/step2" component={OnboardingStep2} />
      <Route path="/Onboarding/step3" component={OnboardingStep3} />
      <Route path="/Onboarding/step4" component={OnboardingStep4} />
      <Route path="/Onboarding/step5" component={OnboardingStep5} />
      <Route path="/Onboarding/step6" component={OnboardingStep6} />
      <Route path="/Onboarding/step7" component={OnboardingStep7} />
      <Route path="/Onboarding/step8" component={OnboardingStep8} />
      <Route path="/Onboarding/step9" component={OnboardingStep9} />
      <Route path="/Onboarding/step10" component={OnboardingStep10} />
      <Route path="/Onboarding/step11" component={OnboardingStep11} />
      <Route path="/Onboarding/step12" component={OnboardingStep12} />
      <Route path="/Onboarding/step13" component={OnboardingStep13} />

      <Route path="/dashboard" component={Home} />
      <Route path="/course/:id" component={Course} />
      <Route path="/learn" component={Learn} />
      <Route path="/invest" component={Invest} />
      <Route path="/invest/:category" component={AssetListing} />
      <Route path="/profile" component={Profile} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/news" component={News} />
      <Route path="/books" component={Books} />
      <Route path="/growtt-ai" component={GrowttAI} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const [location] = useLocation();

  const noSidebarRoutes = [
    "/", "/signup", "/verify", "/onboarding",
    "/Onboarding/step1", "/Onboarding/step2", "/Onboarding/step3",
    "/Onboarding/step4", "/Onboarding/step5", "/Onboarding/step6",
    "/Onboarding/step7", "/Onboarding/step8", "/Onboarding/step9",
    "/Onboarding/step10", "/Onboarding/step11", "/Onboarding/step12",
    "/Onboarding/step13",
  ];

const showSidebar = !location.toLowerCase().startsWith("/onboarding") && 
                    !["/", "/signup", "/verify"].includes(location);


  const getCurrentPage = () => {
    if (location === "/") return "login";
    if (location === "/dashboard") return "home";
    if (location.startsWith("/learn") || location.startsWith("/course"))
      return "learn";
    if (location.startsWith("/invest")) return "invest";
    if (location === "/profile") return "profile";
    if (location === "/leaderboard") return "leaderboard";
    if (location === "/news") return "news";
    return "login";
  };

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex min-h-screen w-full">
        {showSidebar && (
          <div className="hidden lg:block">
            <AppSidebar currentPage={getCurrentPage()} />
          </div>
        )}
        <main className="flex-1 w-full">
          <Router />
        </main>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="growtt-ui-theme">
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <AppLayout />
          </TooltipProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
