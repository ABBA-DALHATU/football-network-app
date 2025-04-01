"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ChevronRight,
  User,
  Users,
  Building2,
} from "lucide-react";

type Role = "player" | "scout" | "club" | null;

export default function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selectedRole) {
      // In a real app, you would save the role to the user's profile
      console.log(`Selected role: ${selectedRole}`);
      // Then redirect to the next step (e.g., complete profile)
      router.push("callback");
    }
  };

  const roles = [
    {
      id: "player",
      title: "Player",
      description:
        "Connect with clubs and scouts, showcase your skills, and find new opportunities in football.",
      icon: User,
      image: "/placeholder.svg?height=200&width=300",
      color: "from-blue-500 to-blue-600",
      lightColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      id: "scout",
      title: "Scout",
      description:
        "Discover talented players, connect with clubs, and build your network in the football industry.",
      icon: Users,
      image: "/placeholder.svg?height=200&width=300",
      color: "from-purple-500 to-purple-600",
      lightColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    {
      id: "club",
      title: "Club",
      description:
        "Find players, connect with scouts, and build your team with our professional networking tools.",
      icon: Building2,
      image: "/placeholder.svg?height=200&width=300",
      color: "from-emerald-500 to-emerald-600",
      lightColor: "bg-emerald-50 dark:bg-emerald-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome to FootNet
          </h1>
          <p className="text-muted-foreground text-lg">
            Select your role to personalize your experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;

            return (
              <div
                key={role.id}
                className="transition-all duration-200 hover:-translate-y-1 active:scale-98"
              >
                <Card
                  className={`h-full cursor-pointer overflow-hidden transition-all ${
                    isSelected
                      ? `border-2 ${role.borderColor} shadow-lg`
                      : "border"
                  }`}
                  onClick={() => setSelectedRole(role.id as Role)}
                >
                  <div className={`h-32 relative ${role.lightColor}`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <role.icon className="h-16 w-16 text-primary opacity-20" />
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-full bg-gradient-to-br ${role.color} text-white`}
                      >
                        <role.icon className="h-5 w-5" />
                      </div>
                      {role.title}
                    </CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>

                  <CardFooter className="pt-0">
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setSelectedRole(role.id as Role)}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            className="w-full md:w-auto px-8"
            disabled={!selectedRole}
            onClick={handleContinue}
          >
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>You can change your role later in your account settings.</p>
        </div>
      </div>
    </div>
  );
}
