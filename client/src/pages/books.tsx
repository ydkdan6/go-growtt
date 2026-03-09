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
  AlertCircle,
} from "lucide-react";
import { useBooks } from "@/hooks/auth/useBooks";
import type { Book } from "@/types/auth.types";

// ─── Skeleton card for loading state ─────────────────────────────────────────
function BookCardSkeleton() {
  return (
    <Card className="border">
      <CardContent className="p-4 flex gap-4">
        <div className="w-20 h-28 rounded-lg bg-muted animate-pulse flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2 justify-between">
          <div className="space-y-2">
            <div className="h-3.5 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
            <div className="h-5 bg-muted animate-pulse rounded w-1/3" />
          </div>
          <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Books() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // ✅ Fetch books from API — cached for 10 minutes
  const { data: books = [], isLoading, isError, error, refetch } = useBooks();

  // ✅ Derive categories dynamically from API data
  const categories = ["All", ...Array.from(new Set(books.map((b) => b.category).filter(Boolean)))];

  const filteredBooks =
    activeCategory === "All"
      ? books
      : books.filter((b) => b.category === activeCategory);

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/dashboard")}
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

        {/* ── Title ── */}
        <div>
          <h1 className="text-2xl font-bold mb-1" data-testid="text-books-title">
            Investment Books
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading books…" : `${books.length} books to grow your knowledge`}
          </p>
        </div>

        {/* ── Category filters — derived from API tags ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              className="flex-shrink-0 text-xs"
              onClick={() => setActiveCategory(cat)}
              data-testid={`button-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* ── Error state ── */}
        {isError && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
            <p className="text-sm text-muted-foreground">{error ?? "Failed to load books."}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        )}

        {/* ── Loading skeletons ── */}
        {isLoading && (
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* ── Book list ── */}
        {!isLoading && !isError && (
          <>
            {filteredBooks.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No books in this category yet.</p>
              </div>
            ) : (
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
                          <p className="font-medium text-sm line-clamp-1" data-testid={`text-book-title-${book.id}`}>
                            {book.title}
                          </p>
                          <p className="text-xs text-muted-foreground mb-1.5">{book.author}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {book.category && (
                              <Badge variant="secondary" className="text-xs">{book.category}</Badge>
                            )}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              {book.downloads > 0 ? `${book.downloads} reads` : "New"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <BookMarked className="w-3 h-3" />
                            {book.views > 0 ? `${book.views} views` : "0 views"}
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
            )}
          </>
        )}
      </main>

      <BottomNav currentPage="learn" />

      {/* ── Book Detail Sheet ── */}
      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => { setSheetOpen(open); if (!open) setSelectedBook(null); }}
      >
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0 flex flex-col">
          {selectedBook && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-5 pb-0">
                <div className="flex items-center gap-2 mb-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSheetOpen(false)}
                    data-testid="button-close-book"
                  >
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
                      {selectedBook.category && (
                        <Badge variant="secondary" className="text-xs">{selectedBook.category}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{selectedBook.views} views</span>
                      <span>{selectedBook.downloads} downloads</span>
                    </div>
                  </div>
                </div>

                {/* ── Stats row ── */}
                <div className="flex gap-3">
                  <Card className="flex-1 border">
                    <CardContent className="p-3 text-center">
                      <BookMarked className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Views</p>
                      <p className="font-semibold text-sm">{selectedBook.views}</p>
                    </CardContent>
                  </Card>
                  <Card className="flex-1 border">
                    <CardContent className="p-3 text-center">
                      <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Downloads</p>
                      <p className="font-semibold text-sm">{selectedBook.downloads}</p>
                    </CardContent>
                  </Card>
                  <Card className="flex-1 border">
                    <CardContent className="p-3 text-center">
                      <Sprout className="w-4 h-4 text-primary mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Seeds</p>
                      <p className="font-semibold text-sm">{selectedBook.seeds}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* ── Description ── */}
                <section>
                  <h4 className="font-semibold text-sm mb-2">About This Book</h4>
                  <p
                    className="text-sm text-muted-foreground leading-relaxed"
                    data-testid="text-book-description"
                  >
                    {selectedBook.description || "No description available."}
                  </p>
                </section>
              </div>

              {/* ── CTA ── */}
              <div className="p-5 pt-3 border-t bg-background">
                {selectedBook.locked ? (
                  <div className="space-y-2">
                    <Button className="w-full" size="lg" disabled data-testid="button-unlock-book">
                      <Lock className="w-5 h-5 mr-2" />
                      Requires {selectedBook.seeds} seeds to unlock
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Earn seeds by completing learning modules
                    </p>
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