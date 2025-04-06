// "use client";

// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import { X, Plus, Upload, Loader2 } from "lucide-react";
// import { z } from "zod";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { updateUserProfile } from "@/actions";
// import { useRouter } from "next/navigation";

// const profileFormSchema = z.object({
//   fullName: z.string().min(2, "Name must be at least 2 characters"),
//   role: z.enum(["PLAYER", "SCOUT", "CLUB", "NONE"]),
//   bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
//   preferredFoot: z.enum(["Left", "Right", "Both"]).optional(),
//   formerClub: z.string().optional(),
// });

// type ProfileFormValues = z.infer<typeof profileFormSchema>;

// interface EditProfileDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   profile: {
//     id: string;
//     fullName: string | null;
//     profileImageUrl: string | null;
//     role: string;
//     bio: string | null;
//     preferredFoot: string | null;
//     formerClub: string | null;
//     stats?: {
//       goals: number;
//       assists: number;
//       matches: number;
//       minutes: number;
//     };
//   };
// }

// export function EditProfileDialog({
//   open,
//   onOpenChange,
//   profile,
// }: EditProfileDialogProps) {
//   const router = useRouter();
//   const [isUploading, setIsUploading] = useState(false);

//   const form = useForm<ProfileFormValues>({
//     resolver: zodResolver(profileFormSchema),
//     defaultValues: {
//       fullName: profile.fullName || "",
//       role: profile.role as "PLAYER" | "SCOUT" | "CLUB" | "NONE",
//       bio: profile.bio || "",
//       preferredFoot:
//         (profile.preferredFoot as "Left" | "Right" | "Both") || undefined,
//       formerClub: profile.formerClub || "",
//     },
//   });

//   useEffect(() => {
//     if (open) {
//       form.reset({
//         fullName: profile.fullName || "",
//         role: profile.role as "PLAYER" | "SCOUT" | "CLUB" | "NONE",
//         bio: profile.bio || "",
//         preferredFoot:
//           (profile.preferredFoot as "Left" | "Right" | "Both") || undefined,
//         formerClub: profile.formerClub || "",
//       });
//     }
//   }, [open, profile, form]);

//   const onSubmit = async (data: ProfileFormValues) => {
//     try {
//       const result = await updateUserProfile(profile.id, {
//         fullName: data.fullName,
//         role: data.role,
//         bio: data.bio,
//         preferredFoot: data.preferredFoot,
//         formerClub: data.formerClub,
//       });

//       if (result.status === 200) {
//         router.refresh();
//         onOpenChange(false);
//       }
//     } catch (error) {
//       console.error("Failed to update profile:", error);
//     }
//   };

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setIsUploading(true);
//     try {
//       // Implement your image upload logic here
//       // This would typically upload to a service like S3 or Cloudinary
//       // Then update the user's profileImageUrl
//       await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate upload
//       setIsUploading(false);
//     } catch (error) {
//       console.error("Failed to upload image:", error);
//       setIsUploading(false);
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={(open) => {
//         if (!open && form.formState.isDirty) {
//           // Add confirmation dialog here if needed
//         }
//         onOpenChange(open);
//       }}
//     >
//       <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-xl">
//         <DialogHeader>
//           <DialogTitle>Edit Profile</DialogTitle>
//         </DialogHeader>

//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="space-y-6 py-4"
//           >
//             <div className="flex flex-col items-center gap-4">
//               <Avatar className="h-24 w-24 border">
//                 <AvatarImage
//                   src={profile.profileImageUrl || ""}
//                   alt={profile.fullName || ""}
//                 />
//                 <AvatarFallback>
//                   {profile.fullName?.charAt(0) || "U"}
//                 </AvatarFallback>
//               </Avatar>
//               <input
//                 type="file"
//                 id="profile-image-upload"
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//               />
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 className="rounded-full"
//                 disabled={isUploading}
//                 onClick={() =>
//                   document.getElementById("profile-image-upload")?.click()
//                 }
//               >
//                 {isUploading ? (
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 ) : (
//                   <Upload className="h-4 w-4 mr-2" />
//                 )}
//                 {isUploading ? "Uploading..." : "Change Picture"}
//               </Button>
//             </div>

//             <Separator />

//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Basic Information</h3>

//               <div className="grid grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="fullName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Full Name</FormLabel>
//                       <FormControl>
//                         <Input {...field} className="rounded-lg" />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="role"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Role</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger className="rounded-lg">
//                             <SelectValue placeholder="Select role" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="PLAYER">Player</SelectItem>
//                           <SelectItem value="SCOUT">Scout</SelectItem>
//                           <SelectItem value="CLUB">Club</SelectItem>
//                           <SelectItem value="NONE">None</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="bio"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Bio</FormLabel>
//                     <FormControl>
//                       <Textarea {...field} rows={4} className="rounded-lg" />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <Separator />

//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Football Details</h3>

//               <FormField
//                 control={form.control}
//                 name="formerClub"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Former Club</FormLabel>
//                     <FormControl>
//                       <Input {...field} className="rounded-lg" />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="preferredFoot"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Preferred Foot</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger className="rounded-lg">
//                           <SelectValue placeholder="Select preferred foot" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="Left">Left</SelectItem>
//                         <SelectItem value="Right">Right</SelectItem>
//                         <SelectItem value="Both">Both</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <DialogFooter>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => onOpenChange(false)}
//                 className="rounded-full"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 className="rounded-full"
//                 disabled={form.formState.isSubmitting}
//               >
//                 {form.formState.isSubmitting ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   "Save Changes"
//                 )}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }


// app/components/profile/edit-profile-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import { updateUserProfile } from "@/actions";
// import { updateUserProfile } from "@/actions/profile-actions";

// Define the form schema with Zod
const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(50),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  preferredFoot: z.string().optional(),
  formerClub: z.string().optional(),
  role: z.nativeEnum(Role),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    fullName: string | null;
    bio: string | null;
    preferredFoot: string | null;
    formerClub: string | null;
    role: Role;
    profileImageUrl: string | null;
  };
}

export function EditProfileDialog({ open, onOpenChange, user }: EditProfileDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName || "",
      bio: user.bio || "",
      preferredFoot: user.preferredFoot || "",
      formerClub: user.formerClub || "",
      role: user.role,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        fullName: user.fullName || "",
        bio: user.bio || "",
        preferredFoot: user.preferredFoot || "",
        formerClub: user.formerClub || "",
        role: user.role,
      });
    }
  }, [open, user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSubmitting(true);
      
      const result = await updateUserProfile(user.id, {
        fullName: data.fullName,
        bio: data.bio,
        preferredFoot: data.preferredFoot,
        formerClub: data.formerClub,
        role: data.role,
      });

      if (result.status === 200) {
        onOpenChange(false);
        // You might want to refresh the page or update the parent component's state here
        window.location.reload(); // Simple solution for now
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 border">
                <AvatarImage src={user.profileImageUrl || ""} alt={user.fullName || ""} />
                <AvatarFallback>
                  {user.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="rounded-full"
                disabled // Temporarily disabled until we implement image upload
              >
                <Upload className="h-4 w-4 mr-2" />
                Change Picture
              </Button>
            </div>

            <Separator />

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="rounded-lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={4} 
                        className="rounded-lg" 
                        placeholder="Tell others about yourself..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Role.PLAYER}>Player</SelectItem>
                        <SelectItem value={Role.SCOUT}>Scout</SelectItem>
                        <SelectItem value={Role.CLUB}>Club</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Player-specific fields */}
            {form.watch("role") === Role.PLAYER && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Player Details</h3>

                  <FormField
                    control={form.control}
                    name="preferredFoot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Foot</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-lg">
                              <SelectValue placeholder="Select preferred foot" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LEFT">Left</SelectItem>
                            <SelectItem value="RIGHT">Right</SelectItem>
                            <SelectItem value="BOTH">Both</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="formerClub"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Former Club</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Your previous club (if any)" 
                            className="rounded-lg" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="rounded-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}