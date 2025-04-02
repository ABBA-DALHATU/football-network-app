"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PostCard } from "@/components/feed/post-card";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import { MessageDialog } from "@/components/profile/message-dialog";
import { CreatePostModal } from "@/components/profile/create-post-modal";
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
  Plus,
  Filter,
  Clock,
} from "lucide-react";
import { fetchProfile } from "@/actions";
import Image from "next/image";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";

interface ProfileData {
  id: string;
  clerkId: string;
  fullName: string | null;
  profileImageUrl: string | null;
  role: string;
  bio: string | null;
  preferredFoot: string | null;
  formerClub: string | null;
  createdAt: Date;
  stats?: {
    goals: number;
    assists: number;
    matches: number;
    minutes: number;
  };
  posts: Array<{
    id: string;
    content: string | null;
    imageUrl: string | null;
    createdAt: Date;
    likes: Array<{ userId: string }>;
    comments: Array<{
      id: string;
      user: {
        id: string;
        fullName: string | null;
        profileImageUrl: string | null;
      };
      content: string;
      createdAt: Date;
    }>;
  }>;
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [profileData, setProfileData] = useState<{
    user: ProfileData;
    isOwnProfile: boolean;
    isConnected: boolean;
    mutualConnections: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const result = await fetchProfile();
      if (result.status === 200 && result.data) {
        setProfileData(result.data);
      }
      setLoading(false);
    };

    loadProfile();
  }, [username]);

  const handleConnect = async () => {
    if (!profileData) return;

    // In a real app, you would call a server action here
    // For now, we'll just update the UI state
    setProfileData({
      ...profileData,
      isConnected: true,
    });
  };

  const handlePostCreated = (newPost: any) => {
    if (!profileData) return;

    setProfileData({
      ...profileData,
      user: {
        ...profileData.user,
        posts: [newPost, ...profileData.user.posts],
      },
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto pb-10 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-4xl mx-auto pb-10 text-center py-20">
        <p>Profile not found</p>
      </div>
    );
  }

  const { user, isOwnProfile, isConnected, mutualConnections } = profileData;

  const formattedStats = [
    { label: "Goals", value: user.stats?.goals || 0 },
    { label: "Assists", value: user.stats?.assists || 0 },
    { label: "Appearances", value: user.stats?.matches || 0 },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Banner and Profile Info */}
      <div className="relative mb-20 sm:mb-24">
        <div className="h-48 sm:h-64 w-full relative rounded-b-lg overflow-hidden bg-muted">
          {user.profileImageUrl && (
            <Image
              src={user.profileImageUrl}
              alt="Profile banner"
              fill
              className="object-cover"
              priority
            />
          )}
          {isOwnProfile && (
            <Button
              size="sm"
              className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background/90 rounded-full"
            >
              Change Banner
            </Button>
          )}
        </div>

        <div className="absolute -bottom-16 sm:-bottom-20 left-4 sm:left-8">
          <div className="relative">
            <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-4 border-background">
              <AvatarImage
                src={user.profileImageUrl || ""}
                alt={user.fullName || ""}
              />
              <AvatarFallback className="text-4xl">
                {user.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <Button
                size="sm"
                className="absolute bottom-2 right-2 rounded-full h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                onClick={() => setShowEditProfile(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="absolute right-4 sm:right-8 -bottom-12 sm:-bottom-16 flex gap-2">
          {isOwnProfile ? (
            <Button
              onClick={() => setShowEditProfile(true)}
              className="rounded-full"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <>
              {isConnected ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowMessageDialog(true)}
                    className="rounded-full"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="secondary" className="rounded-full">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Connected
                  </Button>
                </>
              ) : (
                <Button onClick={handleConnect} className="rounded-full">
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
          <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-xl">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">{user.fullName}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="rounded-full">
                      {user.role}
                    </Badge>
                    {!isOwnProfile && isConnected && (
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {mutualConnections} mutual connections
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{user.bio}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {format(user.createdAt, "MMMM yyyy")}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-xl">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Football Details</h2>

              <div className="space-y-4">
                {user.formerClub && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">Former Club</h3>
                    </div>
                    <Badge variant="outline" className="rounded-full">
                      {user.formerClub}
                    </Badge>
                  </div>
                )}

                {user.preferredFoot && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Footprints className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">Preferred Foot</h3>
                    </div>
                    <span className="text-sm">{user.preferredFoot}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Key Stats</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {formattedStats.map((stat, index) => (
                      <div
                        key={index}
                        className="text-center p-2 bg-muted rounded-lg"
                      >
                        <div className="text-lg font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">
                          {stat.label}
                        </div>
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
          <Tabs
            defaultValue="posts"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <div className="flex items-center justify-between mb-4">
              <TabsList className="rounded-full p-1 h-auto bg-muted/70">
                <TabsTrigger
                  value="posts"
                  className="rounded-full text-sm px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 data-[state=active]:text-primary"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="rounded-full text-sm px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 data-[state=active]:text-primary"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Activity
                </TabsTrigger>
              </TabsList>

              {isOwnProfile && activeTab === "posts" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setShowCreatePost(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              )}

              {!isOwnProfile && activeTab === "posts" && (
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              )}
            </div>

            <TabsContent value="posts" className="space-y-4 mt-0">
              {user.posts.length === 0 ? (
                <Card className="overflow-hidden shadow-sm rounded-xl">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No posts yet</p>
                    {isOwnProfile && (
                      <Button
                        className="mt-4 rounded-full"
                        onClick={() => setShowCreatePost(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Post
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                user.posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={{
                      ...post,
                      user: {
                        id: user.id,
                        fullName: user.fullName,
                        profileImageUrl: user.profileImageUrl,
                        role: user.role,
                      },
                      likeCount: post.likes.length,
                      commentCount: post.comments.length,
                      currentUserLiked: post.likes.some(
                        (like) => like.userId === user.id
                      ),
                    }}
                    currentUserId={user.id}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="activity">
              <Card className="overflow-hidden shadow-sm rounded-xl">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    Recent activity will appear here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={showEditProfile}
        onOpenChange={setShowEditProfile}
        profile={user}
      />

      {/* Message Dialog */}
      <MessageDialog
        open={showMessageDialog}
        onOpenChange={setShowMessageDialog}
        recipient={{
          id: user.id,
          name: user.fullName || "",
          avatar: user.profileImageUrl || "",
        }}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        open={showCreatePost}
        onOpenChange={setShowCreatePost}
        onPostCreated={handlePostCreated}
        user={{
          id: user.id,
          name: user.fullName || "",
          avatar: user.profileImageUrl || "",
        }}
      />
    </div>
  );
}
