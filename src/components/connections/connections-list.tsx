// app/components/connections/connections-list.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageSquare, UserMinus, Users } from "lucide-react";
import { MessageDialog } from "@/components/profile/message-dialog";
import Link from "next/link";
import { removeConnection } from "@/actions";
import { useRouter } from "next/navigation";

interface ConnectionsListProps {
  connections: Array<{
    id: string;
    user: {
      id: string;
      fullName: string | null;
      profileImageUrl: string | null;
      role: string;
      email: string;
    };
    mutualConnections: number;
    createdAt: Date;
  }>;
  onConnectionRemoved: (connectionId: string) => void;
}

export function ConnectionsList({ connections, onConnectionRemoved }: ConnectionsListProps) {
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const router = useRouter();

  const handleRemoveClick = (connection: any) => {
    setSelectedConnection(connection);
    setShowRemoveDialog(true);
  };

  const handleMessageClick = (connection: any) => {
    setSelectedConnection(connection);
    setShowMessageDialog(true);
  };

  const confirmRemove = async () => {
    try {
      setIsRemoving(true);
      const result = await removeConnection(selectedConnection.id);
      if (result.status === 200) {
        onConnectionRemoved(selectedConnection.id);
        setShowRemoveDialog(false);
        router.refresh(); // Refresh to update the UI
      }
    } catch (error) {
      console.error("Failed to remove connection:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      {connections.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No connections found. Connect with other users to grow your network!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connections.map((connection) => (
            <Card key={connection.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardContent className="p-0">
                <div className="flex items-start p-4">
                  <Link href={`/profile/${connection.user.id}`} className="shrink-0">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={connection.user.profileImageUrl || ""} alt={connection.user.fullName || ""} />
                      <AvatarFallback>
                        {connection.user.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Link>

                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <Link
                          href={`/profile/${connection.user.id}`}
                          className="font-semibold hover:underline truncate block"
                        >
                          {connection.user.fullName || "Unknown User"}
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="font-normal">
                            {connection.user.role}
                          </Badge>
                        </div>
                      </div>

                      {connection.mutualConnections > 0 && (
                        <div className="flex items-center text-xs text-muted-foreground mt-1 sm:mt-0">
                          <Users className="h-3 w-3 mr-1" />
                          {connection.mutualConnections} mutual
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex border-t">
                  <Button
                    variant="ghost"
                    className="flex-1 rounded-none h-11 text-sm"
                    onClick={() => handleMessageClick(connection)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <div className="w-px bg-border h-11" />
                  <Button
                    variant="ghost"
                    className="flex-1 rounded-none h-11 text-sm hover:text-destructive"
                    onClick={() => handleRemoveClick(connection)}
                  >
                    <UserMinus className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Remove Connection Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Connection</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedConnection?.user.fullName} from your connections? They will not be
              notified.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setShowRemoveDialog(false)}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmRemove}
              disabled={isRemoving}
            >
              {isRemoving ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      {selectedConnection && (
        <MessageDialog 
          open={showMessageDialog} 
          onOpenChange={setShowMessageDialog} 
          recipient={selectedConnection.user} 
        />
      )}
    </>
  );
}