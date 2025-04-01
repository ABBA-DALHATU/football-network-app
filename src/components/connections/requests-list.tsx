"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Clock, Users } from "lucide-react"
import Link from "next/link"

interface RequestsListProps {
  requests: {
    incoming: any[]
    outgoing: any[]
  }
}

export function RequestsList({ requests }: RequestsListProps) {
  const [acceptedRequests, setAcceptedRequests] = useState<string[]>([])
  const [rejectedRequests, setRejectedRequests] = useState<string[]>([])
  const [cancelledRequests, setCancelledRequests] = useState<string[]>([])

  const handleAccept = (id: string) => {
    setAcceptedRequests((prev) => [...prev, id])
  }

  const handleReject = (id: string) => {
    setRejectedRequests((prev) => [...prev, id])
  }

  const handleCancel = (id: string) => {
    setCancelledRequests((prev) => [...prev, id])
  }

  // Filter out accepted, rejected, and cancelled requests
  const filteredIncoming = requests.incoming.filter(
    (request) => !acceptedRequests.includes(request.id) && !rejectedRequests.includes(request.id),
  )

  const filteredOutgoing = requests.outgoing.filter((request) => !cancelledRequests.includes(request.id))

  const hasIncoming = filteredIncoming.length > 0
  const hasOutgoing = filteredOutgoing.length > 0
  const hasNoRequests = !hasIncoming && !hasOutgoing

  return (
    <div className="space-y-6">
      {hasNoRequests && (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              {requests.incoming.length === 0 && requests.outgoing.length === 0
                ? "No pending connection requests."
                : "No requests match your search criteria."}
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
            {filteredIncoming.map((request) => (
              <Card key={request.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-0">
                  <div className="flex items-start p-4">
                    <Link href={`/profile/${request.username}`} className="shrink-0">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage src={request.avatar} alt={request.name} />
                        <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>

                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <div>
                          <Link
                            href={`/profile/${request.username}`}
                            className="font-semibold hover:underline truncate block"
                          >
                            {request.name}
                          </Link>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="font-normal">
                              {request.role}
                            </Badge>
                            {request.team && <span className="truncate">{request.team}</span>}
                          </div>
                        </div>

                        {request.mutualConnections > 0 && (
                          <div className="flex items-center text-xs text-muted-foreground mt-1 sm:mt-0">
                            <Users className="h-3 w-3 mr-1" />
                            {request.mutualConnections} mutual
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex border-t">
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none h-11 text-sm hover:text-primary hover:bg-primary/10"
                      onClick={() => handleAccept(request.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <div className="w-px bg-border h-11" />
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none h-11 text-sm hover:text-destructive"
                      onClick={() => handleReject(request.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
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
            {filteredOutgoing.map((request) => (
              <Card key={request.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-0">
                  <div className="flex items-start p-4">
                    <Link href={`/profile/${request.username}`} className="shrink-0">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage src={request.avatar} alt={request.name} />
                        <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>

                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <div>
                          <Link
                            href={`/profile/${request.username}`}
                            className="font-semibold hover:underline truncate block"
                          >
                            {request.name}
                          </Link>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="font-normal">
                              {request.role}
                            </Badge>
                            {request.team && <span className="truncate">{request.team}</span>}
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground mt-1 sm:mt-0">Sent {request.sentTime}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex border-t">
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none h-11 text-sm hover:text-destructive"
                      onClick={() => handleCancel(request.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

