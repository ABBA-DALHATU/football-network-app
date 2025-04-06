"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2 } from "lucide-react";
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
import { sendMessage } from "@/actions";
import { useRouter } from "next/navigation";

const messageFormSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message cannot exceed 1000 characters"),
});

type MessageFormValues = z.infer<typeof messageFormSchema>;

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipient: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export function MessageDialog({
  open,
  onOpenChange,
  recipient,
}: MessageDialogProps) {
  const router = useRouter();
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: MessageFormValues) => {
    try {
      const result = await sendMessage(recipient.id, data.content);

      if (result.status === 201) {
        router.refresh();
        form.reset();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-[500px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={recipient.avatar || ""} alt={recipient.name} />
              <AvatarFallback>{recipient.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>Message {recipient.name}</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={`Write a message to ${recipient.name}...`}
                      rows={6}
                      className="resize-none rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                className="rounded-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
