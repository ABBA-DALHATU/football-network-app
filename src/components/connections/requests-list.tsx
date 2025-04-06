// app/components/connections/requests-list.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, Users } from "lucide-react";
import Link from "next/link";
import { respondToConnectionRequest, cancelConnectionRequest } from "@/actions";
import { useRouter } from "next/navigation";

interface RequestsListProps {
  requests: {
    incoming: Array<{
      id: string;
      user: {
        id: string;
        fullName: string | null;
        profileImageUrl: string | null;
        role: string;
        email: string;
      };
      createdAt: Date;
    }>;
    outgoing: Array<{
      id: string;
      user: {
        id: string;
        fullName: string | null;
        profileImageUrl: string | null;
        role: string;
        email: string;
      };
      createdAt: Date;
    }>;
  };
  onRequestResponded: (requestId: string, accepted: boolean) => void;
  onRequestCancelled: (requestId: string) => void;
}

export function RequestsList({ requests, onRequestResponded, onRequestCancelled }: RequestsListProps) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const router = useRouter();

  const handleAccept = async (requestId: string) => {
    try {
      setIsProcessing(`accept-${requestId}`);
      const result = await respondToConnectionRequest(requestId, true);
      if (result.status === 200) {
        onRequestResponded(requestId, true);
        router.refresh(); // Refresh to update the UI
      }
    } catch (error) {
      console.error("Failed to accept request:", error);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setIsProcessing(`reject-${requestId}`);
      const result = await respondToConnectionRequest(requestId, false);
      if (result.status === 200) {
        onRequestResponded(requestId, false);
        router.refresh(); // Refresh to update the UI
      }
    } catch (error) {
      console.error("Failed to reject request:", error);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleCancel = async (requestId: string) => {
    try {
      setIsProcessing(`cancel-${requestId}`);
      const result = await cancelConnectionRequest(requestId);
      if (result.status === 200) {
        onRequestCancelled(requestId);
        router.refresh(); // Refresh to update the UI
      }
    } catch (error) {
      console.error("Failed to cancel request:", error);
    } finally {
      setIsProcessing(null);
    }
  };

  const hasIncoming = requests.incoming.length > 0;
  const hasOutgoing = requests.outgoing.length > 0;
  const hasNoRequests = !hasIncoming && !hasOutgoing;

  return (
    <div className="space-y-6">
      {hasNoRequests && (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No pending connection requests.
            </p>
          </CardContent>
        </Card>
      )}

      {hasIncoming && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Incoming Requests
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.incoming.map((request) => (
              <Card key={request.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-0">
                  <div className="flex items-start p-4">
                    <Link href={`/profile/${request.user.id}`} className="shrink-0">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage src={request.user.profileImageUrl || ""} alt={request.user.fullName || ""} />
                        <AvatarFallback>
                          {request.user.fullName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Link>

                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <div>
                          <Link
                            href={`/profile/${request.user.id}`}
                            className="font-semibold hover:underline truncate block"
                          >
                            {request.user.fullName || "Unknown User"}
                          </Link>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="font-normal">
                              {request.user.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex border-t">
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none h-11 text-sm hover:text-primary hover:bg-primary/10"
                      onClick={() => handleAccept(request.id)}
                      disabled={isProcessing === `accept-${request.id}`}
                    >
                      {isProcessing === `accept-${request.id}` ? (
                        "Processing..."
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Accept
                        </>
                      )}
                    </Button>
                    <div className="w-px bg-border h-11" />
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none h-11 text-sm hover:text-destructive"
                      onClick={() => handleReject(request.id)}
                      disabled={isProcessing === `reject-${request.id}`}
                    >
                      {isProcessing === `reject-${request.id}` ? (
                        "Processing..."
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {hasOutgoing && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Outgoing Requests
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.outgoing.map((request) => (
              <Card key={request.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-0">
                  <div className="flex items-start p-4">
                    <Link href={`/profile/${request.user.id}`} className="shrink-0">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage src={request.user.profileImageUrl || ""} alt={request.user.fullName || ""} />
                        <AvatarFallback>
                          {request.user.fullName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Link>

                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <div>
                          <Link
                            href={`/profile/${request.user.id}`}
                            className="font-semibold hover:underline truncate block"
                          >
                            {request.user.fullName || "Unknown User"}
                          </Link>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="font-normal">
                              {request.user.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex border-t">
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none h-11 text-sm hover:text-destructive"
                      onClick={() => handleCancel(request.id)}
                      disabled={isProcessing === `cancel-${request.id}`}
                    >
                      {isProcessing === `cancel-${request.id}` ? (
                        "Processing..."
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Cancel Request
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}