"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { createPost } from "@/actions/posts";
import { useRouter } from "next/navigation";

const postFormSchema = z
  .object({
    content: z.string().max(1000, "Post content cannot exceed 1000 characters"),
    image: z.any().optional(),
  })
  .refine((data) => data.content.trim().length > 0 || data.image, {
    message: "Please add text or an image to your post",
    path: ["content"],
  });

type PostFormValues = z.infer<typeof postFormSchema>;

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated?: (post: any) => void;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

export function CreatePostModal({
  open,
  onOpenChange,
  onPostCreated,
  user,
}: CreatePostModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      content: "",
      image: null,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      form.setValue("image", file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImageFile(null);
    form.setValue("image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: PostFormValues) => {
    try {
      const result = await createPost(data.content, imageFile || undefined);

      if (result.status === 201 && result.data && onPostCreated) {
        onPostCreated(result.data);
        router.refresh(); // Refresh to update cache
      }

      // Reset form
      form.reset();
      setSelectedImage(null);
      setImageFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
          setSelectedImage(null);
          setImageFile(null);
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-[500px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        <div className="flex gap-3 mt-4">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium">{user.name}</div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <textarea
                      {...field}
                      ref={(e) => {
                        textareaRef.current = e;
                        field.ref(e);
                      }}
                      placeholder="What's on your mind?"
                      className="w-full min-h-[100px] resize-none bg-muted/50 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                      onChange={(e) => {
                        field.onChange(e);
                        handleTextareaChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedImage && (
              <div className="relative mt-2 rounded-xl overflow-hidden border">
                <div className="absolute top-2 right-2 z-10">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full opacity-90"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Image
                  src={selectedImage}
                  alt="Selected image"
                  width={500}
                  height={300}
                  className="w-full object-cover max-h-[300px]"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Add Image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="submit"
                className="w-full rounded-full"
                disabled={
                  isSubmitting || (!form.getValues("content") && !selectedImage)
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
