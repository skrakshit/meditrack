
"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Patient, MedicalRecord } from "@/lib/types";
import { format } from "date-fns";
import { medicalRecords as initialMedicalRecords } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { FileText, PlusCircle, Upload } from "lucide-react";

interface PatientDetailsDialogProps {
  patient: Patient;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const formSchema = z.object({
  type: z.enum(["Note", "Report"]),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  file: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function PatientDetailsDialog({
  patient,
  isOpen,
  onOpenChange,
}: PatientDetailsDialogProps) {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(
    initialMedicalRecords.filter((r) => r.patientId === patient.id)
  );
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "Note",
      title: "",
      content: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    const newRecord: MedicalRecord = {
      id: `rec${medicalRecords.length + 1 + initialMedicalRecords.length}`,
      patientId: patient.id,
      date: new Date(),
      type: data.type,
      title: data.title,
      content: data.content,
      fileUrl: data.file ? URL.createObjectURL(data.file) : undefined,
    };
    setMedicalRecords((prev) => [newRecord, ...prev]);
    form.reset();
    toast({
      title: "Medical Record Added",
      description: `A new ${data.type.toLowerCase()} has been added for ${patient.name}.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            {patient.name}'s Medical Records
          </DialogTitle>
          <DialogDescription>
            View and manage patient history and add new records.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
            <div className="md:col-span-1 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Patient Details</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <p><strong>Age:</strong> {patient.age}</p>
                        <p><strong>Gender:</strong> {patient.gender}</p>
                        <p><strong>Contact:</strong> {patient.contact}</p>
                        <p><strong>Status:</strong> {patient.status}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Add New Record</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Record Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                            <SelectValue placeholder="Select a type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Note">Note</SelectItem>
                                            <SelectItem value="Report">Report</SelectItem>
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                        <Input placeholder="e.g., Diagnosis, Check-up Notes" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                        <Textarea placeholder="Detailed notes..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Record
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
          <div className="md:col-span-2 overflow-hidden flex flex-col">
             <h3 className="text-lg font-semibold mb-4 font-headline">History</h3>
            <ScrollArea className="flex-grow">
              <div className="space-y-4 pr-4">
                {medicalRecords.length > 0 ? (
                  medicalRecords.map((record) => (
                    <Card key={record.id}>
                      <CardHeader>
                        <CardTitle className="text-base flex justify-between items-center">
                          <span>{record.title}</span>
                          <span className="text-xs font-normal text-muted-foreground">
                            {format(record.date, "dd-MMM-yyyy")}
                          </span>
                        </CardTitle>
                        <DialogDescription className="text-xs">{record.type}</DialogDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{record.content}</p>
                        {record.fileUrl && (
                          <Button variant="link" className="p-0 h-auto mt-2">
                            <a href={record.fileUrl} target="_blank" rel="noopener noreferrer">View Attachment</a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    <FileText className="mx-auto h-12 w-12" />
                    <p className="mt-4">No medical records found for this patient.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
