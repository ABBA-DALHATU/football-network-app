"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ConnectionsList } from "@/components/connections/connections-list"
import { RequestsList } from "@/components/connections/requests-list"
import { Search, Users, UserPlus } from "lucide-react"
import { generateConnections, generateRequests } from "@/lib/mock-data"

export default function ConnectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("connections")

  // Generate mock data
  const connections = generateConnections(15)
  const requests = generateRequests(8)

  // Filter connections based on search query and role filter
  const filteredConnections = connections.filter((connection) => {
    const matchesSearch =
      connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.username.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || connection.role === roleFilter

    return matchesSearch && matchesRole
  })

  // Filter requests based on search query
  const filteredRequests = {
    incoming: requests.incoming.filter(
      (request) =>
        request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.username.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
    outgoing: requests.outgoing.filter(
      (request) =>
        request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.username.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Connections</h1>
          <div className="flex items-center gap-2">
            {activeTab === "connections" ? (
              <Button size="sm" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">My Connections:</span> {connections.length}
              </Button>
            ) : (
              <Button size="sm" variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Pending Requests:</span>{" "}
                {requests.incoming.length + requests.outgoing.length}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="connections" className="w-full" onValueChange={setActiveTab}>
        <div className="sticky top-[calc(4rem+56px)] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="connections" className="text-base">
                Connections
              </TabsTrigger>
              <TabsTrigger value="requests" className="text-base">
                Requests
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search connections..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {activeTab === "connections" && (
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Player">Players</SelectItem>
                    <SelectItem value="Coach">Coaches</SelectItem>
                    <SelectItem value="Scout">Scouts</SelectItem>
                    <SelectItem value="Club">Clubs</SelectItem>
                    <SelectItem value="Agent">Agents</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>

        <TabsContent value="connections" className="mt-0">
          <ConnectionsList connections={filteredConnections} />
        </TabsContent>

        <TabsContent value="requests" className="mt-0">
          <RequestsList requests={filteredRequests} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

