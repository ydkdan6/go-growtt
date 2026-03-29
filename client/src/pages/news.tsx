import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ThemeToggle } from "../components/theme-toggle";
import { BottomNav } from "../components/bottom-nav";
import {
  ArrowLeft, Newspaper, TrendingUp, Clock, Bookmark, Share2,
  ChevronRight, Flame, Bitcoin, Building2, BarChart3, Sparkles,
  AlertCircle, Eye, Sprout, Lock,
} from "lucide-react";
import { useBlogs } from "@/hooks/general/useBlogs";
import type { Blog } from "@/types/general.types";

// ─── Helpers 

const getCategoryColor = (tag: string) => {
  switch (tag.toLowerCase()) {
    case "stocks":    return "bg-primary/10 text-primary";
    case "crypto":    return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
    case "property":
    case "real estate": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "economy":   return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
    case "guide":     return "bg-green-500/10 text-green-600 dark:text-green-400";
    default:          return "bg-muted text-muted-foreground";
  }
};

const getCategoryIcon = (tag: string) => {
  switch (tag.toLowerCase()) {
    case "stocks":    return <BarChart3  className="w-4 h-4" />;
    case "crypto":    return <Bitcoin    className="w-4 h-4" />;
    case "property":
    case "real estate": return <Building2 className="w-4 h-4" />;
    default:          return <Newspaper  className="w-4 h-4" />;
  }
};

const formatDate = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  < 7)   return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ArticleSkeleton() {
  return (
    <Card className="border">
      <CardContent className="p-4 flex gap-3">
        <div className="w-12 h-12 rounded-xl bg-muted animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
          <div className="h-4 bg-muted animate-pulse rounded w-full" />
          <div className="h-3 bg-muted animate-pulse rounded w-4/5" />
          <div className="h-3 bg-muted animate-pulse rounded w-1/4 mt-1" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function News() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [savedArticles, setSavedArticles]   = useState<string[]>([]);

  // ── API ───────────────────────────────────────────────────────────────────
  const { data: blogs = [], isLoading, isError, refetch } = useBlogs();

  // ── Derived ───────────────────────────────────────────────────────────────
  // Build category tabs dynamically from API tags
  const uniqueTags = [...new Set(blogs.map((b) => b.tag).filter(Boolean))];

  const categories = [
    { id: "all", label: "All", icon: Newspaper },
    ...uniqueTags.map((tag) => ({
      id: tag.toLowerCase().replace(/\s+/g, ""),
      label: tag,
      icon: tag.toLowerCase().includes("crypto")
        ? Bitcoin
        : tag.toLowerCase().includes("stock")
        ? BarChart3
        : tag.toLowerCase().includes("real") || tag.toLowerCase().includes("property")
        ? Building2
        : Newspaper,
    })),
  ];

  const filteredBlogs =
    activeCategory === "all"
      ? blogs
      : blogs.filter(
          (b) => b.tag.toLowerCase().replace(/\s+/g, "") === activeCategory
        );

  // First blog = featured, rest = list
  const featuredBlog: Blog | undefined = filteredBlogs[0];
  const listBlogs = filteredBlogs.slice(1);

  const toggleSave = (id: string) =>
    setSavedArticles((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/")} data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <Newspaper className="w-5 h-5 text-primary" />
            <span className="font-semibold">News & Insights</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-4 lg:pt-6 space-y-5 lg:space-y-6">

        {/* ── Category Filter — dynamic from API tags ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 w-20 rounded-md bg-muted animate-pulse flex-shrink-0" />
              ))
            : categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  className="flex-shrink-0 gap-1.5"
                  onClick={() => setActiveCategory(cat.id)}
                  data-testid={`category-${cat.id}`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </Button>
              ))
          }
        </div>

        {/* ── Error state ── */}
        {isError && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
            <p className="text-sm text-muted-foreground">Failed to load articles.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>Try Again</Button>
          </div>
        )}

        {/* ── Loading: featured skeleton ── */}
        {isLoading && (
          <div className="rounded-2xl bg-muted animate-pulse h-44 w-full" />
        )}

        {/* ── Featured article — first blog from API ── */}
        {!isLoading && !isError && featuredBlog && (
          <Card
            className="border-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70 overflow-hidden cursor-pointer hover-elevate"
            data-testid="featured-article"
          >
            <CardContent className="p-5 relative">
              {/* Cover image if available */}
              {featuredBlog.imageUrl && (
                <img
                  src={featuredBlog.imageUrl}
                  alt={featuredBlog.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
              )}

              <div className="absolute top-3 right-3 flex items-center gap-2">
                <Badge className="bg-orange-500 text-white gap-1">
                  <Flame className="w-3 h-3" />
                  Trending
                </Badge>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  {featuredBlog.tag && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      {featuredBlog.tag}
                    </Badge>
                  )}
                  <span className="text-primary-foreground/70 text-xs flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {featuredBlog.views.toLocaleString()} views
                  </span>
                  {featuredBlog.locked && (
                    <Badge className="bg-white/20 text-white border-0 gap-1 ml-auto">
                      <Lock className="w-3 h-3" />
                      {featuredBlog.requiredSeed} seeds
                    </Badge>
                  )}
                </div>

                <h2 className="text-xl font-bold text-primary-foreground mb-2 leading-tight">
                  {featuredBlog.title}
                </h2>
                <p className="text-primary-foreground/80 text-sm line-clamp-2 mb-4">
                  {featuredBlog.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-primary-foreground/60 text-xs">{featuredBlog.authors}</span>
                    <span className="text-primary-foreground/40 text-xs">·</span>
                    <span className="text-primary-foreground/60 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(featuredBlog.pubDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
                      onClick={(e) => { e.stopPropagation(); toggleSave(featuredBlog.id); }}
                      data-testid="save-featured"
                    >
                      <Bookmark className={`w-4 h-4 ${savedArticles.includes(featuredBlog.id) ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
                      data-testid="share-featured"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Article list ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Latest News</h3>
            {!isLoading && (
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="w-3 h-3" />
                {filteredBlogs.length} articles
              </Badge>
            )}
          </div>

          {/* Loading skeletons */}
          {isLoading && (
            <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
              {Array.from({ length: 4 }).map((_, i) => <ArticleSkeleton key={i} />)}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && filteredBlogs.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Newspaper className="w-10 h-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No articles available yet.</p>
            </div>
          )}

          {/* Article cards — skip first (featured) */}
          {!isLoading && !isError && listBlogs.length > 0 && (
            <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
              {listBlogs.map((blog) => (
                <Card
                  key={blog.id}
                  className={`border hover-elevate cursor-pointer ${blog.locked ? "opacity-70" : ""}`}
                  data-testid={`article-${blog.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Image or icon */}
                      {blog.imageUrl ? (
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getCategoryColor(blog.tag)}`}>
                          {getCategoryIcon(blog.tag)}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {blog.tag && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {blog.tag}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {blog.views.toLocaleString()}
                          </span>
                          {blog.locked && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-0.5">
                              <Sprout className="w-2.5 h-2.5 text-primary" />
                              {blog.requiredSeed}
                            </Badge>
                          )}
                        </div>

                        <h4 className="font-medium text-sm leading-snug line-clamp-2 mb-1">
                          {blog.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {blog.description}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-xs text-muted-foreground truncate">{blog.authors}</span>
                            <span className="text-muted-foreground/40 text-xs flex-shrink-0">·</span>
                            <span className="text-xs text-muted-foreground flex-shrink-0 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(blog.pubDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={(e) => { e.stopPropagation(); toggleSave(blog.id); }}
                              data-testid={`save-${blog.id}`}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${savedArticles.includes(blog.id) ? "fill-current text-primary" : ""}`} />
                            </Button>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* ── Market Pulse — static (no market data endpoint yet) ── */}
        <section>
          <h3 className="font-semibold mb-3">Market Pulse</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "NGX ASI",   value: "98,432",  change: "+1.24%", up: true,  sub: null            },
              { label: "BTC/NGN",   value: "₦152.4M", change: "+2.87%", up: true,  sub: null            },
              { label: "USD/NGN",   value: "₦1,520",  change: null,     up: null,  sub: "Official Rate" },
              { label: "Inflation", value: "28.9%",   change: null,     up: null,  sub: "YoY"           },
            ].map(({ label, value, change, up, sub }) => (
              <Card key={label} className="border">
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className="font-bold text-lg">{value}</p>
                  {change ? (
                    <p className={`text-xs flex items-center justify-center gap-0.5 ${up ? "text-green-600" : "text-red-500"}`}>
                      <TrendingUp className="w-3 h-3" />
                      {change}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <BottomNav currentPage="news" />
    </div>
  );
}