import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { OnboardingProvider } from "./context/OnboardingContext";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import NotFound from "./pages/not-found";
import Home from "./pages/home";
import Course from "./pages/course";
import Learn from "./pages/learn";
import Invest from "./pages/invest";
import AssetListing from "./pages/asset-listing";
import Profile from "./pages/profile";
import Leaderboard from "./pages/leaderboard";
import News from "./pages/news";
import Books from "./pages/books";
import GrowttAI from "./pages/growtt-ai";

// Auth Imports
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Verify from "./pages/Auth/Verify";

// Onboarding Imports
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

// ─── Auth check ───────────────────────────────────────────────────────────────
// Authenticated = has token + user_id in localStorage (set by signInApi)
const isAuthenticated = (): boolean => {
  return !!(
    localStorage.getItem("access_token") &&
    localStorage.getItem("user_id")
  );
};

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
// Redirects unauthenticated users to "/" (Login).
function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  if (!isAuthenticated()) {
    return <Redirect to="/" />;
  }
  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* ── Public ── */}
      <Route path="/" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/verify" component={Verify} />

      {/* ── Protected: Onboarding ── */}
      <Route path="/onboarding">{() => <ProtectedRoute component={OnboardingInitial} />}</Route>
      <Route path="/Onboarding/step1">{() => <ProtectedRoute component={OnboardingStep1} />}</Route>
      <Route path="/Onboarding/step2">{() => <ProtectedRoute component={OnboardingStep2} />}</Route>
      <Route path="/Onboarding/step3">{() => <ProtectedRoute component={OnboardingStep3} />}</Route>
      <Route path="/Onboarding/step4">{() => <ProtectedRoute component={OnboardingStep4} />}</Route>
      <Route path="/Onboarding/step5">{() => <ProtectedRoute component={OnboardingStep5} />}</Route>
      <Route path="/Onboarding/step6">{() => <ProtectedRoute component={OnboardingStep6} />}</Route>
      <Route path="/Onboarding/step7">{() => <ProtectedRoute component={OnboardingStep7} />}</Route>
      <Route path="/Onboarding/step8">{() => <ProtectedRoute component={OnboardingStep8} />}</Route>
      <Route path="/Onboarding/step9">{() => <ProtectedRoute component={OnboardingStep9} />}</Route>
      <Route path="/Onboarding/step10">{() => <ProtectedRoute component={OnboardingStep10} />}</Route>
      <Route path="/Onboarding/step11">{() => <ProtectedRoute component={OnboardingStep11} />}</Route>
      <Route path="/Onboarding/step12">{() => <ProtectedRoute component={OnboardingStep12} />}</Route>
      <Route path="/Onboarding/step13">{() => <ProtectedRoute component={OnboardingStep13} />}</Route>

      {/* ── Protected: App ── */}
      <Route path="/dashboard">{() => <ProtectedRoute component={Home} />}</Route>
      <Route path="/course/:id">{() => <ProtectedRoute component={Course} />}</Route>
      <Route path="/learn">{() => <ProtectedRoute component={Learn} />}</Route>
      <Route path="/invest">{() => <ProtectedRoute component={Invest} />}</Route>
      <Route path="/invest/:category">{() => <ProtectedRoute component={AssetListing} />}</Route>
      <Route path="/profile">{() => <ProtectedRoute component={Profile} />}</Route>
      <Route path="/leaderboard">{() => <ProtectedRoute component={Leaderboard} />}</Route>
      <Route path="/news">{() => <ProtectedRoute component={News} />}</Route>
      <Route path="/books">{() => <ProtectedRoute component={Books} />}</Route>
      <Route path="/growtt-ai">{() => <ProtectedRoute component={GrowttAI} />}</Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const [location] = useLocation();

  const isOnboardingRoute = location.toLowerCase().startsWith("/onboarding");
  const showSidebar =
    !isOnboardingRoute && !["/", "/signup", "/verify"].includes(location);

  const getCurrentPage = () => {
    if (location === "/") return "login";
    if (location === "/dashboard") return "home";
    if (location.startsWith("/learn") || location.startsWith("/course")) return "learn";
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
          <OnboardingProvider>
            <Router />
          </OnboardingProvider>
        </main>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="growtt-ui-theme">
      {/* ✅ Use env var — never hardcode client ID */}
      <GoogleOAuthProvider clientId='253450538876-6nmff3d51l73rhj6nt3raeceddtk4079.apps.googleusercontent.com'>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <AppLayout />
          </TooltipProvider>
          {import.meta.env.DEV && (
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
          )}
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;