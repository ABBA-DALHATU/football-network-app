"use client";

import { useState, useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PostCard } from "@/components/feed/post-card";
import { useInView } from "react-intersection-observer";
import { Loader2, Sparkles, TrendingUp, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fetchPosts, createPost } from "@/actions/posts";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  userId: string;
  content: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    fullName: string | null;
    profileImageUrl: string | null;
    role: string;
    stats?: Array<{
      goals: number;
      assists: number;
      matches: number;
    }>;
  };
  likes: Array<{ userId: string }>;
  comments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      fullName: string | null;
      profileImageUrl: string | null;
    };
  }>;
  likeCount: number;
  commentCount: number;
}

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<"your-feed" | "for-you">(
    "your-feed"
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  const [newPostText, setNewPostText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // Load initial posts
  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true);
      const result = await fetchPosts(1, 10, activeTab);
      if (result.status === 200) {
        setPosts(result.data || []);
        setHasMore((result.data?.length || 0) >= 10);
      }
      setLoading(false);
    };

    loadInitialPosts();
  }, [activeTab]);

  // Handle infinite scrolling
  useEffect(() => {
    if (inView && !loading && hasMore) {
      loadMorePosts();
    }
  }, [inView]);

  const loadMorePosts = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const result = await fetchPosts(nextPage, 10, activeTab);

    if (result.status === 200) {
      setPosts((prev) => [...prev, ...(result.data || [])]);
      setPage(nextPage);
      setHasMore((result.data?.length || 0) >= 10);
    }

    setLoading(false);
  };

  const handleTabChange = (value: string) => {
    if (value === "your-feed" || value === "for-you") {
      setActiveTab(value);
      setPosts([]);
      setPage(1);
      setHasMore(true);
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    setIsSubmitting(true);
    const result = await createPost(newPostText);

    if (result.status === 201 && result.data) {
      setPosts((prev) => [result.data, ...prev]);
      setNewPostText("");
      router.refresh(); // Refresh to ensure cache is updated
    }

    setIsSubmitting(false);

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewPostText(e.target.value);

    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-10">
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-1 pb-2">
        <h1 className="text-2xl font-bold mb-4">Feed</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Create Post Card */}
        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow mt-16">
          <CardContent className="p-4">
            <form onSubmit={handleSubmitPost}>
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder.svg" alt="Your Avatar" />
                  <AvatarFallback>YA</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex flex-col">
                  <div className="relative w-full min-h-[40px] mb-2">
                    <textarea
                      ref={inputRef}
                      placeholder="What's on your mind?"
                      className="w-full min-h-[40px] resize-none bg-muted/50 rounded-xl p-3 pr-10 focus:outline-none focus:ring-1 focus:ring-primary"
                      value={newPostText}
                      onChange={handleTextareaChange}
                      rows={1}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="rounded-full text-muted-foreground"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Media
                      </Button>
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      className="rounded-full px-4"
                      disabled={!newPostText.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        "Post"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Feed Tabs */}
        <div className="flex items-center justify-between">
          <Tabs
            defaultValue="your-feed"
            className="w-full"
            onValueChange={handleTabChange}
          >
            <div className="flex items-center justify-between mb-4">
              <TabsList className="rounded-full p-1 h-auto bg-muted/70">
                <TabsTrigger
                  value="your-feed"
                  className={cn(
                    "rounded-full text-sm px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm",
                    "transition-all duration-200 data-[state=active]:text-primary"
                  )}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Your Feed
                </TabsTrigger>
                <TabsTrigger
                  value="for-you"
                  className={cn(
                    "rounded-full text-sm px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm",
                    "transition-all duration-200 data-[state=active]:text-primary"
                  )}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  For You
                </TabsTrigger>
              </TabsList>

              <Button variant="ghost" size="sm" className="rounded-full">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <TabsContent value="your-feed" className="mt-0 space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={{
                    id: post.id,
                    user: {
                      id: post.user.id,
                      name: post.user.fullName || "Unknown",
                      avatar: post.user.profileImageUrl || "/placeholder.svg",
                      role: post.user.role,
                      stats: post.user.stats?.[0],
                    },
                    content: post.content || "",
                    image: post.imageUrl || undefined,
                    likes: post.likeCount,
                    comments: post.comments.map((comment) => ({
                      id: comment.id,
                      user: {
                        id: comment.user.id,
                        name: comment.user.fullName || "Unknown",
                        avatar:
                          comment.user.profileImageUrl || "/placeholder.svg",
                      },
                      content: comment.content,
                      timestamp: comment.createdAt.toISOString(),
                    })),
                    timestamp: post.createdAt.toISOString(),
                    hasLiked: post.likes.some(
                      (like) => like.userId === post.user.id
                    ), // This should check against current user
                  }}
                />
              ))}
            </TabsContent>

            <TabsContent value="for-you" className="mt-0 space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={{
                    id: post.id,
                    user: {
                      id: post.user.id,
                      name: post.user.fullName || "Unknown",
                      avatar: post.user.profileImageUrl || "/placeholder.svg",
                      role: post.user.role,
                      stats: post.user.stats?.[0],
                    },
                    content: post.content || "",
                    image: post.imageUrl || undefined,
                    likes: post.likeCount,
                    comments: post.comments.map((comment) => ({
                      id: comment.id,
                      user: {
                        id: comment.user.id,
                        name: comment.user.fullName || "Unknown",
                        avatar:
                          comment.user.profileImageUrl || "/placeholder.svg",
                      },
                      content: comment.content,
                      timestamp: comment.createdAt.toISOString(),
                    })),
                    timestamp: post.createdAt.toISOString(),
                    hasLiked: post.likes.some(
                      (like) => like.userId === post.user.id
                    ), // This should check against current user
                  }}
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Loading indicator for infinite scroll */}
        <div ref={ref} className="flex justify-center py-4">
          {loading && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
          {!hasMore && !loading && (
            <p className="text-sm text-muted-foreground">
              No more posts to load
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
