// app/components/messaging/user-search.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface UserSearchProps {
  onSearch: (query: string) => Promise<any[]>;
  onSelectUser: (user: any) => void;
}

export function UserSearch({ onSearch, onSelectUser }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Search for users when query changes
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setLoading(true);
      const timer = setTimeout(async () => {
        const users = await onSearch(searchQuery);
        setFilteredUsers(users);
        setLoading(false);
        setIsSearching(true);
      }, 300); // Debounce for 300ms

      return () => clearTimeout(timer);
    } else {
      setFilteredUsers([]);
      setIsSearching(false);
      setLoading(false);
    }
  }, [searchQuery, onSearch]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUserSelect = (user: any) => {
    onSelectUser(user);
    setSearchQuery("");
    setIsSearching(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by name or email..."
          className="pl-9 pr-8 rounded-full"
          onFocus={() => searchQuery.trim() && setIsSearching(true)}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isSearching && (
        <div className="absolute z-10 mt-1 w-full bg-background border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="space-y-2 p-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[180px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer"
                onClick={() => handleUserSelect(user)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profileImageUrl || ""} alt={user.fullName || ""} />
                  <AvatarFallback>{user.fullName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.fullName || "Unknown User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-muted-foreground">
              No users found matching "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}