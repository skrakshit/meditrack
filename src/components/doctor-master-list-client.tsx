
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { Doctor, Department, DoctorStatus } from "@/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { doctors as doctorsData } from "@/lib/data"; // Import the shared data

interface DoctorMasterListClientProps {
  initialDoctors: Doctor[];
  departments: Department[];
}

const doctorStatuses: DoctorStatus[] = ["Active", "Inactive", "On Leave"];

const createFormSchema = (departments: Department[]) => z.object({
  name: z.string().min(1, "Name is required"),
  department: z.enum(departments as [string, ...string[]]),
  qualification: z.string().min(1, "Qualification is required"),
  experience: z.coerce.number().min(0, "Experience must be a positive number"),
  languages: z.string().min(1, "Languages are required"),
  email: z.string().email("Invalid email address"),
  status: z.enum(doctorStatuses as [string, ...string[]]),
});

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;


export function DoctorMasterListClient({ initialDoctors, departments }: DoctorMasterListClientProps) {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const { toast } = useToast();
  
  const formSchema = createFormSchema(departments);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      department: departments[0] || "General",
      qualification: "",
      experience: 5,
      languages: "",
      email: "",
      status: "Active"
    },
  });

  const onSubmit = (data: FormValues) => {
      const newDoctor: Doctor = {
        id: `doc${doctorsData.length + 1}`,
        availability: ["Monday 9-12", "Wednesday 14-17"], // dummy availability
        ...data,
        languages: data.languages.split(",").map((s) => s.trim()),
      };
      
      // Add to the shared doctors array
      doctorsData.push(newDoctor);
      setDoctors([...doctorsData]); // Update local state to reflect change if needed

      toast({
        title: "Doctor Added Successfully",
        description: `${newDoctor.name} has been added to the master list.`,
      });
      form.reset();
  };

  return (
    <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">
                Add New Doctor
            </h1>
        </div>
        <p className="text-sm text-muted-foreground">
            Fill in the form below to add a new doctor to the system.
        </p>
        <div className="mt-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Dr. John Doe" {...field} />
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
                        <Input placeholder="e.g., john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {departments.map((d) => (
                            <SelectItem key={d} value={d}>
                                {d}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="qualification"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Qualification</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., MBBS, MD" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="languages"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Languages Spoken</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., English, Hindi, Tamil" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Experience (Yrs)</FormLabel>
                            <FormControl>
                            <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {doctorStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
                <Button type="submit">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Save Doctor
                </Button>
                </form>
            </Form>
        </div>
    </div>
  );
}
