"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Share2,
  UserPlus,
  MoreHorizontal,
  UserCheck,
  ThumbsUp,
  Send,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { likePost, addComment, requestConnection } from "@/actions/posts";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

interface User {
  id: string;
  fullName: string | null;
  profileImageUrl: string | null;
  role: string;
  stats?: Array<{
    goals: number;
    assists: number;
    matches: number;
  }>;
}

interface Comment {
  id: string;
  user: {
    id: string;
    fullName: string | null;
    profileImageUrl: string | null;
  };
  content: string;
  createdAt: Date;
}

interface PostCardProps {
  post: {
    id: string;
    user: User;
    content: string | null;
    imageUrl: string | null;
    createdAt: Date;
    likes: Array<{ userId: string }>;
    comments: Comment[];
    likeCount: number;
    commentCount: number;
    currentUserLiked: boolean;
    isConnected: boolean;
  };
  currentUserId: string;
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.currentUserLiked);
  const [likesCount, setLikesCount] = useState(post.likeCount);
  const [isConnected, setIsConnected] = useState(post.isConnected);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments);
  const [isSaved, setIsSaved] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleLike = async () => {
    try {
      const result = await likePost(post.id);
      if (result.status === 200) {
        setIsLiked(result.action === "liked");
        setLikesCount((prev) =>
          result.action === "liked" ? prev + 1 : prev - 1
        );
        router.refresh(); // Refresh to update cache
      }
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleConnect = async () => {
    try {
      const result = await requestConnection(post.user.id);
      if (result.status === 201) {
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Failed to request connection:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const result = await addComment(post.id, newComment);
      if (result.status === 201 && result.data) {
        setComments((prev) => [
          {
            id: result.data.id,
            user: {
              id: result.data.user.id,
              fullName: result.data.user.fullName,
              profileImageUrl: result.data.user.profileImageUrl,
            },
            content: result.data.content,
            createdAt: new Date(result.data.timestamp),
          },
          ...prev,
        ]);
        setNewComment("");
        router.refresh(); // Refresh to update cache
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleSavePost = () => {
    setIsSaved(!isSaved);
  };

  const getPositionBadge = (role: string) => {
    switch (role) {
      case "PLAYER":
        return "Player";
      case "SCOUT":
        return "Scout";
      case "CLUB":
        return "Club";
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="shadow-sm hover:shadow-md transition-shadow overflow-hidden border-muted">
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${post.user.id}`}>
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={post.user.profileImageUrl || "/placeholder.svg"}
                    alt={post.user.fullName || "User"}
                  />
                  <AvatarFallback>
                    {post.user.fullName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/profile/${post.user.id}`}
                    className="font-semibold hover:underline"
                  >
                    {post.user.fullName || "Unknown User"}
                  </Link>
                  {post.user.role && (
                    <Badge variant="outline" className="text-xs font-normal">
                      {getPositionBadge(post.user.role)}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span>
                    {post.createdAt
                      ? formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                        })
                      : "just now"}
                  </span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuItem
                  onClick={handleSavePost}
                  className="cursor-pointer"
                >
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 mr-2" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      <span>Save post</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Hide post</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive">
                  <span>Report post</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="whitespace-pre-line mb-3">{post.content}</p>
          {post.imageUrl && (
            <div className="relative rounded-xl overflow-hidden mt-2 border">
              <Image
                src={post.imageUrl}
                alt="Post image"
                width={600}
                height={400}
                className="w-full object-cover max-h-[400px]"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <ThumbsUp className="h-3.5 w-3.5 fill-primary text-primary" />
              <span>{likesCount > 0 ? likesCount : ""}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>
                {comments.length > 0 ? `${comments.length} comments` : ""}
              </span>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="flex items-center justify-between w-full">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "flex-1 gap-2 rounded-full",
                      isLiked && "text-primary font-medium bg-primary/10"
                    )}
                    onClick={handleLike}
                  >
                    <Heart
                      className={cn("h-4 w-4", isLiked && "fill-primary")}
                    />
                    Like
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isLiked ? "Unlike this post" : "Like this post"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-2 rounded-full"
                    onClick={() => setShowComments(true)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Comment
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Comment on this post</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-2 rounded-full"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this post</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {!isConnected && post.user.id !== currentUserId ? (
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 gap-2 rounded-full"
                      onClick={handleConnect}
                    >
                      <UserPlus className="h-4 w-4" />
                      Connect
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with {post.user.fullName || "this user"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : post.user.id !== currentUserId ? (
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 gap-2 rounded-full text-primary bg-primary/10"
                      disabled
                    >
                      <UserCheck className="h-4 w-4" />
                      Connected
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      You are connected with {post.user.fullName || "this user"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : null}
          </div>
        </CardFooter>
      </Card>

      {/* Comments Dialog */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-auto rounded-xl">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-2 mt-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Current User" />
              <AvatarFallback>CU</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input
                ref={commentInputRef}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                className="flex-1 rounded-full bg-muted/50"
              />
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="rounded-full"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={comment.user.profileImageUrl || "/placeholder.svg"}
                        alt={comment.user.fullName || "User"}
                      />
                      <AvatarFallback>
                        {comment.user.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted/50 p-3 rounded-xl">
                        <div className="font-medium text-sm">
                          {comment.user.fullName || "User"}
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span>
                          {post.createdAt
                            ? formatDistanceToNow(new Date(post.createdAt), {
                                addSuffix: true,
                              })
                            : "just now"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
