"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/feed/post-card";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { generatePosts } from "@/lib/mock-data";

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState("your-feed");
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();

  // Load initial posts
  useEffect(() => {
    setPosts(generatePosts(10, activeTab === "your-feed"));
  }, [activeTab]);

  // Handle infinite scrolling
  useEffect(() => {
    if (inView && !loading) {
      loadMorePosts();
    }
  }, [inView]);

  const loadMorePosts = async () => {
    setLoading(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newPosts = generatePosts(5, activeTab === "your-feed");
    setPosts((prev) => [...prev, ...newPosts]);
    setPage((prev) => prev + 1);
    setLoading(false);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPosts([]);
    setPage(1);
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-10">
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-4 pb-2">
        <h1 className="text-2xl font-bold mb-4">Feed</h1>
        <Tabs
          defaultValue="your-feed"
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="your-feed" className="text-base">
              Your Feed
            </TabsTrigger>
            <TabsTrigger value="for-you" className="text-base">
              For You
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {/* Loading indicator for infinite scroll */}
        <div ref={ref} className="flex justify-center py-4">
          {loading && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
        </div>
      </div>
    </div>
  );
}
