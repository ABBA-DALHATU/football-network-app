// app/connections/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConnectionsList } from "@/components/connections/connections-list";
import { RequestsList } from "@/components/connections/requests-list";
import { Search, Users, UserPlus } from "lucide-react";
import { getConnections, getConnectionRequests } from "@/actions";
import { Role } from "@prisma/client";

export default function ConnectionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [activeTab, setActiveTab] = useState("connections");
  const [connections, setConnections] = useState<any[]>([]);
  const [requests, setRequests] = useState({
    incoming: [],
    outgoing: [],
  });
  const [loading, setLoading] = useState({
    connections: true,
    requests: true,
  });
  const [error, setError] = useState({
    connections: null,
    requests: null,
  });

  useEffect(() => {
    const loadConnections = async () => {
      try {
        setLoading(prev => ({ ...prev, connections: true }));
        const result = await getConnections();
        if (result.status === 200) {
          setConnections(result.data);
        } else {
          setError(prev => ({ ...prev, connections: result.message }));
        }
      } catch (err) {
        setError(prev => ({ ...prev, connections: "Failed to load connections" }));
      } finally {
        setLoading(prev => ({ ...prev, connections: false }));
      }
    };

    const loadRequests = async () => {
      try {
        setLoading(prev => ({ ...prev, requests: true }));
        const result = await getConnectionRequests();
        if (result.status === 200) {
          setRequests(result.data);
        } else {
          setError(prev => ({ ...prev, requests: result.message }));
        }
      } catch (err) {
        setError(prev => ({ ...prev, requests: "Failed to load requests" }));
      } finally {
        setLoading(prev => ({ ...prev, requests: false }));
      }
    };

    if (activeTab === "connections") {
      loadConnections();
    } else {
      loadRequests();
    }
  }, [activeTab]);

  // Filter connections based on search query and role filter
  const filteredConnections = connections.filter((connection) => {
    const matchesSearch =
      connection.user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || connection.user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Filter requests based on search query
  const filteredRequests = {
    incoming: requests.incoming.filter(
      (request) =>
        request.user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
    outgoing: requests.outgoing.filter(
      (request) =>
        request.user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  };

  const handleConnectionRemoved = (connectionId: string) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId));
  };

  const handleRequestResponded = (requestId: string, accepted: boolean) => {
    if (accepted) {
      // Move the request to connections
      const acceptedRequest = requests.incoming.find(r => r.id === requestId);
      if (acceptedRequest) {
        setConnections(prev => [...prev, {
          id: requestId,
          user: acceptedRequest.user,
          mutualConnections: 0,
          createdAt: new Date(),
        }]);
      }
    }
    setRequests(prev => ({
      ...prev,
      incoming: prev.incoming.filter(r => r.id !== requestId),
    }));
  };

  const handleRequestCancelled = (requestId: string) => {
    setRequests(prev => ({
      ...prev,
      outgoing: prev.outgoing.filter(r => r.id !== requestId),
    }));
  };

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
                <Select 
                  value={roleFilter} 
                  onValueChange={(value: Role | "all") => setRoleFilter(value)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value={Role.PLAYER}>Players</SelectItem>
                    <SelectItem value={Role.SCOUT}>Scouts</SelectItem>
                    <SelectItem value={Role.CLUB}>Clubs</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>

        <TabsContent value="connections" className="mt-12">
          {loading.connections ? (
            <div className="flex justify-center py-8">
              <p>Loading connections...</p>
            </div>
          ) : error.connections ? (
            <div className="text-red-500 text-center py-8">
              {error.connections}
            </div>
          ) : (
            <ConnectionsList 
              connections={filteredConnections} 
              onConnectionRemoved={handleConnectionRemoved}
            />
          )}
        </TabsContent>

        <TabsContent value="requests" className="mt-12">
          {loading.requests ? (
            <div className="flex justify-center py-8">
              <p>Loading requests...</p>
            </div>
          ) : error.requests ? (
            <div className="text-red-500 text-center py-8">
              {error.requests}
            </div>
          ) : (
            <RequestsList 
              requests={filteredRequests} 
              onRequestResponded={handleRequestResponded}
              onRequestCancelled={handleRequestCancelled}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}