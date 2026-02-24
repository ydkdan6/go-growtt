import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { BottomNav } from "@/components/bottom-nav";
import { 
  ArrowLeft,
  Newspaper,
  TrendingUp,
  Clock,
  Bookmark,
  Share2,
  ChevronRight,
  Flame,
  Bitcoin,
  Building2,
  BarChart3,
  Sparkles
} from "lucide-react";

const featuredArticle = {
  id: 1,
  title: "Nigerian Stock Market Hits Record High as Foreign Investment Surges",
  excerpt: "The Nigerian Exchange Limited (NGX) reached an all-time high today as foreign institutional investors increased their holdings in Nigerian equities...",
  category: "Stocks",
  readTime: "5 min read",
  timeAgo: "2 hours ago",
  image: "stocks",
  trending: true,
};

const newsArticles = [
  {
    id: 2,
    title: "Bitcoin Breaks $100K: What Nigerian Investors Should Know",
    excerpt: "Cryptocurrency markets are surging with Bitcoin reaching new heights. Here's how to position your portfolio...",
    category: "Crypto",
    readTime: "4 min read",
    timeAgo: "4 hours ago",
  },
  {
    id: 3,
    title: "Lagos Real Estate: Top 5 Neighborhoods for Investment in 2025",
    excerpt: "From Lekki to Victoria Island, we analyze the best property investment opportunities in Lagos...",
    category: "Real Estate",
    readTime: "7 min read",
    timeAgo: "6 hours ago",
  },
  {
    id: 4,
    title: "CBN Announces New Interest Rate Policy: Impact on Your Investments",
    excerpt: "The Central Bank of Nigeria has announced changes to monetary policy. Here's what it means for your portfolio...",
    category: "Economy",
    readTime: "3 min read",
    timeAgo: "8 hours ago",
  },
  {
    id: 5,
    title: "Dangote Refinery Begins Operations: Stock Analysis",
    excerpt: "With the refinery now operational, we analyze the potential impact on Dangote Cement and related stocks...",
    category: "Stocks",
    readTime: "6 min read",
    timeAgo: "1 day ago",
  },
  {
    id: 6,
    title: "Beginner's Guide: How to Start Investing with Just ₦10,000",
    excerpt: "You don't need millions to start building wealth. Learn how to begin your investment journey with a small amount...",
    category: "Guide",
    readTime: "8 min read",
    timeAgo: "1 day ago",
  },
  {
    id: 7,
    title: "Ethereum 2.0: Is It Time to Add ETH to Your Portfolio?",
    excerpt: "With the successful transition to proof-of-stake, Ethereum presents new opportunities for Nigerian investors...",
    category: "Crypto",
    readTime: "5 min read",
    timeAgo: "2 days ago",
  },
];

const categories = [
  { id: "all", label: "All", icon: Newspaper },
  { id: "stocks", label: "Stocks", icon: BarChart3 },
  { id: "crypto", label: "Crypto", icon: Bitcoin },
  { id: "realestate", label: "Property", icon: Building2 },
];

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "stocks": return "bg-primary/10 text-primary";
    case "crypto": return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
    case "real estate": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "economy": return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
    case "guide": return "bg-green-500/10 text-green-600 dark:text-green-400";
    default: return "bg-muted text-muted-foreground";
  }
};

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "stocks": return <BarChart3 className="w-4 h-4" />;
    case "crypto": return <Bitcoin className="w-4 h-4" />;
    case "real estate": return <Building2 className="w-4 h-4" />;
    default: return <Newspaper className="w-4 h-4" />;
  }
};

export default function News() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [savedArticles, setSavedArticles] = useState<number[]>([]);

  const toggleSave = (id: number) => {
    setSavedArticles(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const filteredArticles = activeCategory === "all" 
    ? newsArticles 
    : newsArticles.filter(a => a.category.toLowerCase().replace(" ", "") === activeCategory);

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
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
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {categories.map((cat) => (
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
          ))}
        </div>

        {/* Featured Article */}
        <Card className="border-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70 overflow-hidden cursor-pointer hover-elevate" data-testid="featured-article">
          <CardContent className="p-5 relative">
            <div className="absolute top-3 right-3 flex items-center gap-2">
              {featuredArticle.trending && (
                <Badge className="bg-orange-500 text-white gap-1">
                  <Flame className="w-3 h-3" />
                  Trending
                </Badge>
              )}
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {featuredArticle.category}
                </Badge>
                <span className="text-primary-foreground/70 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {featuredArticle.readTime}
                </span>
              </div>
              <h2 className="text-xl font-bold text-primary-foreground mb-2 leading-tight">
                {featuredArticle.title}
              </h2>
              <p className="text-primary-foreground/80 text-sm line-clamp-2 mb-4">
                {featuredArticle.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-primary-foreground/60 text-xs">{featuredArticle.timeAgo}</span>
                <div className="flex items-center gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
                    onClick={(e) => { e.stopPropagation(); toggleSave(featuredArticle.id); }}
                    data-testid="save-featured"
                  >
                    <Bookmark className={`w-4 h-4 ${savedArticles.includes(featuredArticle.id) ? 'fill-current' : ''}`} />
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

        {/* Latest News */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Latest News</h3>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="w-3 h-3" />
              {filteredArticles.length} articles
            </Badge>
          </div>

          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {filteredArticles.map((article) => (
              <Card 
                key={article.id}
                className="border hover-elevate cursor-pointer"
                data-testid={`article-${article.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getCategoryColor(article.category)}`}>
                      {getCategoryIcon(article.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm leading-snug line-clamp-2 mb-1">
                        {article.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{article.timeAgo}</span>
                        <div className="flex items-center gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-7 w-7"
                            onClick={(e) => { e.stopPropagation(); toggleSave(article.id); }}
                            data-testid={`save-${article.id}`}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${savedArticles.includes(article.id) ? 'fill-current text-primary' : ''}`} />
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
        </section>

        {/* Market Quick Stats */}
        <section>
          <h3 className="font-semibold mb-3">Market Pulse</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="border">
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">NGX ASI</p>
                <p className="font-bold text-lg">98,432</p>
                <p className="text-xs text-green-600 flex items-center justify-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  +1.24%
                </p>
              </CardContent>
            </Card>
            <Card className="border">
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">BTC/NGN</p>
                <p className="font-bold text-lg">₦152.4M</p>
                <p className="text-xs text-green-600 flex items-center justify-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  +2.87%
                </p>
              </CardContent>
            </Card>
            <Card className="border">
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">USD/NGN</p>
                <p className="font-bold text-lg">₦1,520</p>
                <p className="text-xs text-muted-foreground">Official Rate</p>
              </CardContent>
            </Card>
            <Card className="border">
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Inflation</p>
                <p className="font-bold text-lg">28.9%</p>
                <p className="text-xs text-muted-foreground">YoY</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <BottomNav currentPage="news" />
    </div>
  );
}
