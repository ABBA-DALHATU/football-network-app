"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, UserPlus, MoreHorizontal, UserCheck, ThumbsUp, Send } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface PostCardProps {
  post: {
    id: string
    user: {
      id: string
      name: string
      username: string
      avatar: string
      position: string
      team: string
      isConnected: boolean
    }
    content: string
    image?: string
    likes: number
    comments: {
      id: string
      user: {
        id: string
        name: string
        username: string
        avatar: string
      }
      content: string
      timestamp: string
    }[]
    timestamp: string
    hasLiked: boolean
  }
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.hasLiked)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [isConnected, setIsConnected] = useState(post.user.isConnected)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState(post.comments)

  const handleLike = () => {
    if (isLiked) {
      setLikesCount((prev) => prev - 1)
    } else {
      setLikesCount((prev) => prev + 1)
    }
    setIsLiked(!isLiked)
  }

  const handleConnect = () => {
    setIsConnected(true)
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment = {
      id: `comment-${Date.now()}`,
      user: {
        id: "current-user",
        name: "Current User",
        username: "currentuser",
        avatar: "/placeholder.svg",
      },
      content: newComment,
      timestamp: "Just now",
    }

    setComments((prev) => [comment, ...prev])
    setNewComment("")
  }

  return (
    <>
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${post.user.username}`}>
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={post.user.avatar} alt={post.user.name} />
                  <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/profile/${post.user.username}`} className="font-semibold hover:underline">
                    {post.user.name}
                  </Link>
                  {post.user.position && (
                    <Badge variant="outline" className="text-xs font-normal">
                      {post.user.position}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  {post.user.team && <span>{post.user.team}</span>}
                  <span className="text-xs">•</span>
                  <span>{post.timestamp}</span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Save post</DropdownMenuItem>
                <DropdownMenuItem>Hide post</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Report post</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="whitespace-pre-line mb-3">{post.content}</p>
          {post.image && (
            <div className="relative rounded-lg overflow-hidden mt-2 border">
              <Image
                src={post.image || "/placeholder.svg"}
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
              <span>{comments.length > 0 ? `${comments.length} comments` : ""}</span>
            </div>
          </div>

          <div className="flex items-center justify-between w-full border-t border-border mt-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn("flex-1 gap-2", isLiked && "text-primary font-medium")}
              onClick={handleLike}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-primary")} />
              Like
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 gap-2" onClick={() => setShowComments(true)}>
              <MessageCircle className="h-4 w-4" />
              Comment
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            {!isConnected && (
              <Button variant="ghost" size="sm" className="flex-1 gap-2" onClick={handleConnect}>
                <UserPlus className="h-4 w-4" />
                Connect
              </Button>
            )}
            {isConnected && (
              <Button variant="ghost" size="sm" className="flex-1 gap-2 text-primary" disabled>
                <UserCheck className="h-4 w-4" />
                Connected
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Comments Dialog */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-auto">
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
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={handleAddComment}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                    <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted p-2 rounded-lg">
                      <div className="font-medium text-sm">{comment.user.name}</div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex gap-3">
                      <span>{comment.timestamp}</span>
                      <button className="hover:text-foreground">Like</button>
                      <button className="hover:text-foreground">Reply</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

