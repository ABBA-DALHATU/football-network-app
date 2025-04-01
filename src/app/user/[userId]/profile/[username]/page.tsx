"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PostCard } from "@/components/feed/post-card"
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog"
import { MessageDialog } from "@/components/profile/message-dialog"
import {
  MapPin,
  Mail,
  Calendar,
  Edit,
  MessageSquare,
  UserPlus,
  UserCheck,
  Trophy,
  Users,
  Briefcase,
  Footprints,
} from "lucide-react"
import { generatePosts } from "@/lib/mock-data"
import Image from "next/image"

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string

  // Mock data - in a real app, this would come from an API
  const isOwnProfile = username === "currentuser"
  const [isConnected, setIsConnected] = useState(!isOwnProfile && Math.random() > 0.5)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)

  // Mock profile data
  const profile = {
    id: "1",
    name: isOwnProfile ? "Current User" : "Alex Johnson",
    username: username,
    role: "Player",
    avatar: "/placeholder.svg",
    banner: "/placeholder.svg?height=300&width=1200",
    bio: "Professional footballer with 10+ years of experience. Midfielder specializing in playmaking and set pieces. Currently a free agent looking for new opportunities.",
    location: "Manchester, UK",
    email: `${username}@example.com`,
    joinedDate: "January 2022",
    formerClubs: ["Manchester United", "Everton FC", "West Ham United"],
    preferredFoot: "Right",
    stats: [
      { label: "Goals", value: "87" },
      { label: "Assists", value: "120" },
      { label: "Appearances", value: "320" },
    ],
    mutualConnections: 12,
  }

  // Generate mock posts
  const posts = generatePosts(5, true).map((post) => ({
    ...post,
    user: {
      ...post.user,
      name: profile.name,
      username: profile.username,
      avatar: profile.avatar,
    },
  }))

  const handleConnect = () => {
    setIsConnected(true)
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Banner and Profile Info */}
      <div className="relative mb-20 sm:mb-24">
        <div className="h-48 sm:h-64 w-full relative rounded-b-lg overflow-hidden">
          <Image
            src={profile.banner || "/placeholder.svg"}
            alt="Profile banner"
            fill
            className="object-cover"
            priority
          />
          {isOwnProfile && (
            <Button
              size="sm"
              className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            >
              Change Banner
            </Button>
          )}
        </div>

        <div className="absolute -bottom-16 sm:-bottom-20 left-4 sm:left-8">
          <div className="relative">
            <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-4 border-background">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="text-4xl">{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <Button
                size="sm"
                className="absolute bottom-2 right-2 rounded-full h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="absolute right-4 sm:right-8 -bottom-12 sm:-bottom-16 flex gap-2">
          {isOwnProfile ? (
            <Button onClick={() => setShowEditProfile(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <>
              {isConnected ? (
                <>
                  <Button variant="outline" onClick={() => setShowMessageDialog(true)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="secondary">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Connected
                  </Button>
                </>
              ) : (
                <Button onClick={handleConnect}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-4 sm:px-0 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{profile.role}</Badge>
                    {!isOwnProfile && isConnected && (
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {profile.mutualConnections} mutual connections
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{profile.bio}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {profile.joinedDate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Football Details</h2>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Former Clubs</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.formerClubs.map((club, index) => (
                      <Badge key={index} variant="outline">
                        {club}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Footprints className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Preferred Foot</h3>
                  </div>
                  <span className="text-sm">{profile.preferredFoot}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Key Stats</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {profile.stats.map((stat, index) => (
                      <div key={index} className="text-center p-2 bg-muted rounded-lg">
                        <div className="text-lg font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Posts */}
        <div className="md:col-span-2">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="posts" className="text-base">
                Posts
              </TabsTrigger>
              <TabsTrigger value="activity" className="text-base">
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4">
              {posts.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No posts yet</p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Recent activity will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog open={showEditProfile} onOpenChange={setShowEditProfile} profile={profile} />

      {/* Message Dialog */}
      <MessageDialog open={showMessageDialog} onOpenChange={setShowMessageDialog} recipient={profile} />
    </div>
  )
}

