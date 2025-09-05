
"use client";

import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { User } from 'lucide-react';

interface EditProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  avatarFile: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function EditProfileDialog({ isOpen, onOpenChange }: EditProfileDialogProps) {
  const { user, setUser } = useUser();
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

   useEffect(() => {
    if (isOpen) {
      form.reset({
        name: user.name,
        email: user.email,
      });
      setPreviewUrl(user.avatarUrl);
    }
  }, [isOpen, user, form]);


  const onSubmit = (data: FormValues) => {
    const newAvatarUrl = data.avatarFile ? URL.createObjectURL(data.avatarFile) : user.avatarUrl;
    
    setUser({
        name: data.name,
        email: data.email,
        avatarUrl: newAvatarUrl,
    });
    
    onOpenChange(false);

    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('avatarFile', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="flex justify-center">
              <button type="button" onClick={handleAvatarClick} className="relative group">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={previewUrl || undefined} alt={user.name} />
                  <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Change
                </div>
              </button>
               <FormField
                  control={form.control}
                  name="avatarFile"
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                          <Input 
                            type="file" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={onFileChange}
                            accept="image/png, image/jpeg, image/gif"
                           />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
                />
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
