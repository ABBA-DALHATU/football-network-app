"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload } from "lucide-react"

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: any
}

export function EditProfileDialog({ open, onOpenChange, profile }: EditProfileDialogProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    role: profile.role,
    bio: profile.bio,
    location: profile.location,
    email: profile.email,
    preferredFoot: profile.preferredFoot,
    formerClubs: [...profile.formerClubs],
    stats: [...profile.stats],
  })

  const [newClub, setNewClub] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddClub = () => {
    if (newClub.trim()) {
      setFormData((prev) => ({
        ...prev,
        formerClubs: [...prev.formerClubs, newClub.trim()],
      }))
      setNewClub("")
    }
  }

  const handleRemoveClub = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      formerClubs: prev.formerClubs.filter((_, i) => i !== index),
    }))
  }

  const handleStatChange = (index: number, field: "label" | "value", value: string) => {
    setFormData((prev) => {
      const newStats = [...prev.stats]
      newStats[index] = { ...newStats[index], [field]: value }
      return { ...prev, stats: newStats }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this data to your API
    console.log("Updated profile:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 border">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button type="button" variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Change Picture
            </Button>
          </div>

          <Separator />

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Player">Player</SelectItem>
                    <SelectItem value="Coach">Coach</SelectItem>
                    <SelectItem value="Scout">Scout</SelectItem>
                    <SelectItem value="Club">Club</SelectItem>
                    <SelectItem value="Agent">Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Football Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Football Details</h3>

            <div className="space-y-2">
              <Label>Former Clubs</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.formerClubs.map((club, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {club}
                    <button
                      type="button"
                      onClick={() => handleRemoveClub(index)}
                      className="ml-1 rounded-full hover:bg-muted-foreground/20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add a club" value={newClub} onChange={(e) => setNewClub(e.target.value)} />
                <Button type="button" onClick={handleAddClub} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredFoot">Preferred Foot</Label>
              <Select
                value={formData.preferredFoot}
                onValueChange={(value) => handleSelectChange("preferredFoot", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred foot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Left">Left</SelectItem>
                  <SelectItem value="Right">Right</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Key Stats</Label>
              <div className="space-y-2">
                {formData.stats.map((stat, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2">
                    <Input
                      className="col-span-2"
                      placeholder="Stat name"
                      value={stat.label}
                      onChange={(e) => handleStatChange(index, "label", e.target.value)}
                    />
                    <Input
                      className="col-span-2"
                      placeholder="Value"
                      value={stat.value}
                      onChange={(e) => handleStatChange(index, "value", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          stats: prev.stats.filter((_, i) => i !== index),
                        }))
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      stats: [...prev.stats, { label: "", value: "" }],
                    }))
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stat
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

