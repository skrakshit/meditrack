

"use client";

import * as React from "react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, MoreHorizontal, FileEdit, UserCog, Ban, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { LabAppointment, Patient } from "@/lib/types";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface LabAppointmentsClientProps {
  initialLabAppointments: LabAppointment[];
  patients: Patient[];
  onCreateOrViewReport?: (appointment: LabAppointment) => void;
  onUpdateStatus?: (appointmentId: string, status: "Completed" | "Cancelled") => void;
}

const formSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  testName: z.string().min(1, "Test name is required"),
  date: z.date({
    required_error: "A date is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function LabAppointmentsClient({
  initialLabAppointments,
  patients,
  onCreateOrViewReport,
  onUpdateStatus,
}: LabAppointmentsClientProps) {
  const [labAppointments, setLabAppointments] =
    useState(initialLabAppointments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const getPatientName = (patientId: string) =>
    patients.find((p) => p.id === patientId)?.name || "Unknown";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      testName: "",
    },
  });

  // This updates local state for storybook/standalone, but parent state if onUpdateStatus is provided
  React.useEffect(() => {
    setLabAppointments(initialLabAppointments);
  }, [initialLabAppointments]);

  const onSubmit = (data: FormValues) => {
    const newLabAppointment: LabAppointment = {
      id: `lab${labAppointments.length + 1}`,
      patientId: data.patientId,
      testName: data.testName,
      date: data.date,
      status: "Scheduled",
    };
    setLabAppointments((prev) => [...prev, newLabAppointment]);
    setIsDialogOpen(false);
    form.reset();
    toast({
      title: "Lab Appointment Scheduled",
      description: `${
        newLabAppointment.testName
      } for ${getPatientName(newLabAppointment.patientId)} has been scheduled.`,
    });
  };

  const getStatusVariant = (status: "Scheduled" | "Completed" | "Cancelled") => {
    switch (status) {
      case "Completed":
        return "default";
      case "Scheduled":
        return "secondary";
      case "Cancelled":
        return "destructive";
    }
  };
  
  const handleStatusUpdate = (id: string, status: "Completed" | "Cancelled") => {
    if (onUpdateStatus) {
      onUpdateStatus(id, status);
    } else {
        // Fallback for standalone usage
        setLabAppointments(current => current.map(a => a.id === id ? {...a, status} : a));
         toast({
            title: "Status Updated",
            description: `Appointment status has been updated to ${status}.`
        });
    }
  }


  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">
            Lab Appointments Queue
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" className="h-8 gap-1" onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Schedule Lab Test
              </span>
            </Button>
          </div>
        </div>
        <div className="rounded-xl border shadow-sm bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Appointment ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Test Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Report</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {labAppointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell className="font-medium">{appt.id}</TableCell>
                  <TableCell>{getPatientName(appt.patientId)}</TableCell>
                  <TableCell>{appt.testName}</TableCell>
                  <TableCell>{format(appt.date, "dd-MMM-yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(appt.status)}>{appt.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {onCreateOrViewReport && appt.status !== 'Cancelled' && (
                       <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onCreateOrViewReport(appt)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {appt.status === 'Completed' ? 'View/Edit Report' : 'Create Report'}
                        </Button>
                    )}
                  </TableCell>
                   <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleStatusUpdate(appt.id, 'Completed')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <UserCog className="mr-2 h-4 w-4" />
                            Edit Patient Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onSelect={() => handleStatusUpdate(appt.id, 'Cancelled')}>
                             <Ban className="mr-2 h-4 w-4" />
                            Cancel Appointment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Schedule Lab Test</DialogTitle>
            <DialogDescription>
              Fill in the details to schedule a new lab test.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-4"
            >
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patients.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
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
                name="testName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Complete Blood Count" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd-MMM-yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0,0,0,0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Schedule Test</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
