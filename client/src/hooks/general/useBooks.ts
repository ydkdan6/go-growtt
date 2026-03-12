import { useQuery } from "@tanstack/react-query";
import { getBooksApi } from "@/api/general.api";
import { adaptBook } from "@/types/general.types";
import type { Book } from "@/types/general.types";
import { parseApiError } from "../../utils/parseApiError";

export const bookKeys = {
  all: ["books"] as const,
  list: () => [...bookKeys.all, "list"] as const,
};

/**
 * Fetches and caches all books from GET /book/book/
 * Adapts raw API shape to the UI Book interface.
 *
 * Usage:
 *   const { data: books, isLoading, isError } = useBooks();
 */
export const useBooks = () => {
  return useQuery<Book[], string>({
    queryKey: bookKeys.list(),
    queryFn: async () => {
      try {
        const raw = await getBooksApi();
        return raw.map(adaptBook);
      } catch (err) {
        const { parseApiError: parse } = await import("../../utils/parseApiError");
        throw parse(err);
      }
    },
    staleTime: 1000 * 60 * 10,  // 10 min — book list rarely changes
    gcTime: 1000 * 60 * 30,     // 30 min cache retention
  });
};