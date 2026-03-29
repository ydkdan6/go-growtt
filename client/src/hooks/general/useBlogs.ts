import { useQuery } from "@tanstack/react-query";
import { getBlogsApi } from "@/api/general.api";
import { adaptBlog } from "@/types/general.types";
import type { Blog } from "@/types/general.types";
import { parseApiError } from "@/utils/parseApiError";

export const blogKeys = {
  all:    ["blogs"] as const,
  list:   () => [...blogKeys.all, "list"] as const,
  byTag:  (tag: string) => [...blogKeys.all, "tag", tag] as const,
};

/**
 * Fetches all blog posts from GET /blog/blog/
 *
 * Usage:
 *   const { data: blogs = [], isLoading, isError } = useBlogs();
 *
 * Filter by tag:
 *   const cryptoBlogs = blogs.filter(b => b.tag === "Crypto");
 */
export const useBlogs = () => {
  return useQuery<Blog[], string>({
    queryKey: blogKeys.list(),
    queryFn: async () => {
      try {
        const raw = await getBlogsApi();
        return raw.map(adaptBlog);
      } catch (err) {
        throw parseApiError(err);
      }
    },
    staleTime: 1000 * 60 * 5,   // 5 min — news changes more often
    gcTime:    1000 * 60 * 15,  // 15 min
  });
};

/**
 * Returns blogs filtered to a specific tag.
 * Same cache as useBlogs() — no extra request.
 *
 * Usage:
 *   const { data: blogs } = useBlogsByTag("Crypto");
 */
export const useBlogsByTag = (tag: string) => {
  const query = useBlogs();
  return {
    ...query,
    data: (query.data ?? []).filter(
      (b) => b.tag.toLowerCase() === tag.toLowerCase()
    ),
  };
};

/**
 * Fetches a single blog post by ID.
 * First tries the list cache — if the post is already cached from useBlogs(),
 * no extra network request is made. Falls back to a direct API call if not found.
 *
 * Usage:
 *   const { data: blog, isLoading } = useBlogById("df876413-...");
 */
export const useBlogById = (id: string) => {
  return useQuery<Blog, string>({
    queryKey: [...blogKeys.all, "detail", id] as const,
    queryFn: async () => {
      try {
        const { getBlogByIdApi } = await import("@/api/general.api");
        const raw = await getBlogByIdApi(id);
        return adaptBlog(raw);
      } catch (err) {
        throw parseApiError(err);
      }
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
    gcTime:    1000 * 60 * 15,
  });
};