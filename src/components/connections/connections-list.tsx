"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MessageSquare, UserMinus, Users } from "lucide-react"
import { MessageDialog } from "@/components/profile/message-dialog"
import Link from "next/link"

interface ConnectionsListProps {
  connections: any[]
}

export function ConnectionsList({ connections }: ConnectionsListProps) {
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState<any>(null)
  const [removedConnections, setRemovedConnections] = useState<string[]>([])

  const handleRemoveClick = (connection: any) => {
    setSelectedConnection(connection)
    setShowRemoveDialog(true)
  }

  const handleMessageClick = (connection: any) => {
    setSelectedConnection(connection)
    setShowMessageDialog(true)
  }

  const confirmRemove = () => {
    setRemovedConnections((prev) => [...prev, selectedConnection.id])
    setShowRemoveDialog(false)
  }

  // Filter out removed connections
  const filteredConnections = connections.filter((connection) => !removedConnections.includes(connection.id))

  return (
    <>
      {filteredConnections.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              {connections.length === 0
                ? "No connections found. Connect with other users to grow your network!"
                : "No connections match your search criteria."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConnections.map((connection) => (
            <Card key={connection.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardContent className="p-0">
                <div className="flex items-start p-4">
                  <Link href={`/profile/${connection.username}`} className="shrink-0">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={connection.avatar} alt={connection.name} />
                      <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Link>

                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <Link
                          href={`/profile/${connection.username}`}
                          className="font-semibold hover:underline truncate block"
                        >
                          {connection.name}
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="font-normal">
                            {connection.role}
                          </Badge>
                          {connection.team && <span className="truncate">{connection.team}</span>}
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
              Are you sure you want to remove {selectedConnection?.name} from your connections? They will not be
              notified.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowRemoveDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      {selectedConnection && (
        <MessageDialog open={showMessageDialog} onOpenChange={setShowMessageDialog} recipient={selectedConnection} />
      )}
    </>
  )
}

