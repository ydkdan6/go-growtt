import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ThemeToggle } from "../components/theme-toggle";
import { BottomNav } from "../components/bottom-nav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import {
  ArrowLeft,
  BookOpen,
  Sprout,
  Clock,
  Star,
  BookMarked,
  ChevronRight,
  Lock,
} from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  seeds: number;
  category: string;
  pages: number;
  readTime: string;
  rating: number;
  description: string;
  chapters: string[];
  locked: boolean;
}

const allBooks: Book[] = [
  {
    id: "intelligent-investor",
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    seeds: 50,
    category: "Value Investing",
    pages: 640,
    readTime: "15 hrs",
    rating: 4.8,
    description: "Often called the greatest investment book ever written, Benjamin Graham's timeless wisdom has guided generations of investors. This book teaches the philosophy of 'value investing' — protecting yourself from substantial error while developing long-term strategies. Warren Buffett calls it 'by far the best book on investing ever written.'",
    chapters: ["The Investor and Inflation", "Defensive vs Enterprising", "Portfolio Policy", "Stock Selection", "Margin of Safety", "Market Fluctuations"],
    locked: false,
  },
  {
    id: "rich-dad-poor-dad",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    seeds: 40,
    category: "Financial Literacy",
    pages: 336,
    readTime: "8 hrs",
    rating: 4.5,
    description: "Robert Kiyosaki shares the story of his two dads — his real father (poor dad) and the father of his best friend (rich dad) — and how both men shaped his thoughts about money and investing. This book challenges conventional wisdom about working for money and teaches readers to make money work for them.",
    chapters: ["The Rich Don't Work for Money", "Why Teach Financial Literacy", "Mind Your Own Business", "History of Taxes", "The Rich Invent Money", "Work to Learn"],
    locked: false,
  },
  {
    id: "random-walk",
    title: "A Random Walk Down Wall Street",
    author: "Burton Malkiel",
    seeds: 60,
    category: "Market Theory",
    pages: 432,
    readTime: "12 hrs",
    rating: 4.6,
    description: "This influential guide introduces the efficient market hypothesis and makes a compelling case for index investing. Malkiel covers everything from historical market bubbles to modern portfolio theory, helping readers understand why trying to beat the market consistently is nearly impossible for most investors.",
    chapters: ["Firm Foundations & Castles", "The Madness of Crowds", "Technical Analysis", "Fundamental Analysis", "Modern Portfolio Theory", "A Fitness Manual for Walkers"],
    locked: false,
  },
  {
    id: "psychology-of-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    seeds: 45,
    category: "Behavioral Finance",
    pages: 256,
    readTime: "6 hrs",
    rating: 4.7,
    description: "Morgan Housel explores the strange ways people think about money through 19 short stories. The book reveals how our personal history, ego, and emotions influence financial decisions far more than spreadsheets and formulas. It teaches that doing well with money has little to do with intelligence and a lot to do with behavior.",
    chapters: ["No One's Crazy", "Luck & Risk", "Never Enough", "Compounding", "Getting Wealthy vs Staying Wealthy", "Tails, You Win"],
    locked: false,
  },
  {
    id: "little-book-investing",
    title: "The Little Book of Common Sense Investing",
    author: "John C. Bogle",
    seeds: 55,
    category: "Index Investing",
    pages: 304,
    readTime: "7 hrs",
    rating: 4.6,
    description: "Vanguard founder John Bogle reveals his key to getting more out of investing: low-cost index funds. This book offers a proven strategy that reduces risk while maximizing returns over the long term. Bogle shows how simple, low-cost investing beats expensive active management.",
    chapters: ["A Parable", "Rational Exuberance", "Cast Your Lot with Business", "How Most Investors Turn a Winner's Game Into a Loser's Game", "The Grand Illusion", "Taxes Are Costs Too"],
    locked: false,
  },
  {
    id: "one-up-wall-street",
    title: "One Up on Wall Street",
    author: "Peter Lynch",
    seeds: 50,
    category: "Stock Picking",
    pages: 304,
    readTime: "9 hrs",
    rating: 4.5,
    description: "Legendary Fidelity fund manager Peter Lynch explains how average investors can use what they already know to outperform Wall Street experts. His approachable style breaks down the process of researching and picking winning stocks using everyday observations and common sense.",
    chapters: ["Preparing to Invest", "Picking Winners", "The Long-term View", "Six Categories of Stocks", "Designing a Portfolio", "The Best Time to Buy and Sell"],
    locked: true,
  },
  {
    id: "think-and-grow-rich",
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    seeds: 35,
    category: "Wealth Mindset",
    pages: 238,
    readTime: "7 hrs",
    rating: 4.4,
    description: "Based on Napoleon Hill's study of over 500 self-made millionaires, this classic reveals the mindset principles behind wealth creation. While not strictly an investment book, it lays the psychological foundation needed to build and maintain wealth over a lifetime.",
    chapters: ["Desire", "Faith", "Auto-Suggestion", "Specialized Knowledge", "Imagination", "Organized Planning"],
    locked: true,
  },
  {
    id: "crypto-assets",
    title: "Cryptoassets",
    author: "Chris Burniske",
    seeds: 65,
    category: "Cryptocurrency",
    pages: 368,
    readTime: "10 hrs",
    rating: 4.3,
    description: "This comprehensive guide provides a framework for investigating and investing in cryptoassets. It covers blockchain technology, different types of crypto tokens, portfolio management strategies, and how to evaluate the potential of various digital assets.",
    chapters: ["What Is Bitcoin?", "The Blockchain", "Cryptoasset Taxonomy", "Fundamental Analysis", "Technical Analysis", "Portfolio Management"],
    locked: true,
  },
];

const categories = ["All", "Value Investing", "Financial Literacy", "Market Theory", "Behavioral Finance", "Index Investing", "Stock Picking", "Wealth Mindset", "Cryptocurrency"];

export default function Books() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filteredBooks = activeCategory === "All"
    ? allBooks
    : allBooks.filter(b => b.category === activeCategory);

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
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
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-semibold">Books</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-5 lg:pt-6 space-y-5">
        <div>
          <h1 className="text-2xl font-bold mb-1" data-testid="text-books-title">Investment Books</h1>
          <p className="text-sm text-muted-foreground">{allBooks.length} books to grow your knowledge</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              className="flex-shrink-0 text-xs"
              onClick={() => setActiveCategory(cat)}
              data-testid={`button-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              className="border hover-elevate cursor-pointer"
              onClick={() => { setSelectedBook(book); setSheetOpen(true); }}
              data-testid={`book-card-${book.id}`}
            >
              <CardContent className="p-4 flex gap-4">
                <div className="w-20 h-28 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 relative">
                  <BookOpen className="w-8 h-8 text-primary/40" />
                  {book.locked && (
                    <div className="absolute inset-0 rounded-lg bg-background/60 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="font-medium text-sm line-clamp-1" data-testid={`text-book-title-${book.id}`}>{book.title}</p>
                    <p className="text-xs text-muted-foreground mb-1.5">{book.author}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{book.category}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {book.rating}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {book.readTime}
                    </div>
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Sprout className="w-3 h-3" />
                      {book.seeds} seeds
                    </Badge>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground self-center flex-shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <BottomNav currentPage="learn" />

      <Sheet open={sheetOpen} onOpenChange={(open) => { setSheetOpen(open); if (!open) setSelectedBook(null); }}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0 flex flex-col">
          {selectedBook && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-5 pb-0">
                <div className="flex items-center gap-2 mb-3">
                  <Button variant="ghost" size="icon" onClick={() => setSheetOpen(false)} data-testid="button-close-book">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <SheetTitle className="text-left text-lg flex-1">{selectedBook.title}</SheetTitle>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-5 pt-2 space-y-5">
                <div className="flex gap-4">
                  <div className="w-28 h-40 rounded-xl bg-gradient-to-br from-primary/25 to-primary/5 flex items-center justify-center flex-shrink-0 relative">
                    <BookOpen className="w-10 h-10 text-primary/40" />
                    {selectedBook.locked && (
                      <div className="absolute inset-0 rounded-xl bg-background/60 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg leading-tight mb-1">{selectedBook.title}</p>
                    <p className="text-sm text-muted-foreground mb-2">{selectedBook.author}</p>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Badge variant="secondary" className="text-xs">{selectedBook.category}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {selectedBook.rating}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{selectedBook.pages} pages</span>
                      <span>{selectedBook.readTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Card className="flex-1 border">
                    <CardContent className="p-3 text-center">
                      <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Read Time</p>
                      <p className="font-semibold text-sm">{selectedBook.readTime}</p>
                    </CardContent>
                  </Card>
                  <Card className="flex-1 border">
                    <CardContent className="p-3 text-center">
                      <BookMarked className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Pages</p>
                      <p className="font-semibold text-sm">{selectedBook.pages}</p>
                    </CardContent>
                  </Card>
                  <Card className="flex-1 border">
                    <CardContent className="p-3 text-center">
                      <Sprout className="w-4 h-4 text-primary mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Reward</p>
                      <p className="font-semibold text-sm">{selectedBook.seeds} seeds</p>
                    </CardContent>
                  </Card>
                </div>

                <section>
                  <h4 className="font-semibold text-sm mb-2">About This Book</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-book-description">{selectedBook.description}</p>
                </section>

                <section>
                  <h4 className="font-semibold text-sm mb-3">Chapters</h4>
                  <div className="space-y-2">
                    {selectedBook.chapters.map((chapter, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-primary">{i + 1}</span>
                        </div>
                        <p className="text-sm flex-1">{chapter}</p>
                        {selectedBook.locked && i > 0 && (
                          <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="p-5 pt-3 border-t bg-background">
                {selectedBook.locked ? (
                  <div className="space-y-2">
                    <Button className="w-full" size="lg" disabled data-testid="button-unlock-book">
                      <Lock className="w-5 h-5 mr-2" />
                      Complete more modules to unlock
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">Earn seeds by completing learning modules</p>
                  </div>
                ) : (
                  <Button className="w-full" size="lg" data-testid="button-start-reading">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Start Reading
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
