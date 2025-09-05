
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Video, Phone, Building, FileEdit, Search, Printer, Users, CreditCard, Stethoscope } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
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
import type { Appointment, Patient, Doctor, AppointmentStatus, AppointmentMode, PaymentStatus, Gender } from "@/lib/types";
import { format, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { AppointmentSlipDialog } from "./appointment-slip-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface AppointmentsClientProps {
  initialAppointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
}

const genders: Gender[] = ["Male", "Female", "Other"];

const formSchema = z.object({
  patientName: z.string().min(1, "Patient name is required."),
  patientAge: z.coerce.number().min(0, "Age must be a positive number."),
  patientGender: z.enum(genders),
  patientContact: z.string().min(10, "Contact must be at least 10 digits."),
  doctorId: z.string().min(1, "Doctor is required"),
  date: z.date({
    required_error: "A date is required.",
  }),
  time: z
    .string()
    .min(1, "Time is required")
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s(AM|PM)$/i, "Invalid time format (e.g., 10:00 AM)"),
  reason: z.string().min(1, "Reason for appointment is required"),
  mode: z.enum(["In-person", "Online", "Telephonic"]),
  duration: z.coerce.number().min(15, "Duration must be at least 15 minutes"),
  fees: z.coerce.number().min(0, "Fees cannot be negative"),
  status: z.enum(["Confirmed", "Pending", "Cancelled", "Completed"]),
  paymentStatus: z.enum(["Paid", "Pending", "Partially Paid"]),
});

type FormValues = z.infer<typeof formSchema>;

const ModeIcons: Record<AppointmentMode, React.ElementType> = {
  "In-person": Building,
  "Online": Video,
  "Telephonic": Phone,
}

const getStatusBadgeVariant = (status: AppointmentStatus) => {
    switch (status) {
        case "Completed":
            return "default";
        case "Confirmed":
            return "default";
        case "Pending":
            return "secondary";
        case "Cancelled":
            return "destructive";
    }
};

const getPaymentStatusBadgeVariant = (status: PaymentStatus) => {
    switch (status) {
        case "Paid":
            return "default";
        case "Pending":
            return "destructive";
        case "Partially Paid":
            return "secondary";
    }
};


const getStatusRowClass = (status: AppointmentStatus) => {
    switch(status) {
        case 'Confirmed':
            return 'bg-green-500/10';
        case 'Pending':
            return 'bg-yellow-500/10';
        case 'Cancelled':
            return 'bg-red-500/10 opacity-70';
        case 'Completed':
            return 'bg-blue-500/10';
        default:
            return '';
    }
}

export function AppointmentsClient({
  initialAppointments,
  patients,
  doctors,
}: AppointmentsClientProps) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [statusFilter, setStatusFilter] = useState<"All" | AppointmentStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const [selectedAppointmentForSlip, setSelectedAppointmentForSlip] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getDoctorName = (doctorId: string) => doctors.find((d) => d.id === doctorId)?.name || "Unknown";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (editingAppointment) {
      form.reset({
          ...editingAppointment,
           date: new Date(editingAppointment.date) 
      });
    } else {
      form.reset({
        patientName: "",
        patientAge: 0,
        patientContact: "",
        patientGender: "Male",
        doctorId: "",
        time: "",
        reason: "",
        mode: "In-person",
        duration: 30,
        fees: 500,
        status: "Confirmed",
        paymentStatus: "Pending",
      });
    }
  }, [editingAppointment, form, isDialogOpen]);


  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    if (selectedDate) {
        filtered = filtered.filter(a => startOfDay(new Date(a.date)).getTime() === startOfDay(selectedDate).getTime());
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    if (searchQuery) {
        filtered = filtered.filter(a => 
            a.patientName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    return filtered;
  }, [appointments, statusFilter, searchQuery, selectedDate]);
  
  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingAppointment(null);
    setIsDialogOpen(true);
  };

  const handlePrintSlip = (appointment: Appointment) => {
    setSelectedAppointmentForSlip(appointment);
    setIsSlipOpen(true);
  };


  const onSubmit = (data: FormValues) => {
    if (editingAppointment) {
      // Update existing appointment
      const updatedAppointments = appointments.map((apt) =>
        apt.id === editingAppointment.id ? { ...apt, ...data, id: apt.id, patientId: apt.patientId } : apt
      );
      setAppointments(updatedAppointments);
      toast({
        title: "Appointment Updated",
        description: "The appointment details have been successfully updated.",
      });
    } else {
        const newAppointment: Appointment = {
          id: `apt${appointments.length + 1}`,
          patientId: `pat${patients.length + appointments.length + 1}`, // Generate a new patient ID
          ...data,
        };
        setAppointments((prev) => [...prev, newAppointment]);
        toast({
          title: "Appointment Scheduled",
          description: `Appointment for ${newAppointment.patientName} with ${getDoctorName(newAppointment.doctorId)} has been scheduled.`,
        });
    }
    setIsDialogOpen(false);
    setEditingAppointment(null);
  };

  return (
    <>
      <div className="flex flex-col gap-4 printable-area-container">
        <div className="flex items-center no-print">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">
            Appointments
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
            <Button
              size="sm"
              className="h-9 gap-1"
              onClick={handleCreate}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Schedule
              </span>
            </Button>
          </div>
        </div>

        <div className="flex items-center no-print">
            <div className="flex items-center gap-2">
                 <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search patient..."
                        className="pl-8 sm:w-[200px] md:w-[300px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                 <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>


        <div className="rounded-xl border shadow-sm bg-card no-print">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => {
                const ModeIcon = ModeIcons[appointment.mode];
                return (
                <TableRow key={appointment.id} className={cn(getStatusRowClass(appointment.status))}>
                   <TableCell>
                      <div className="font-medium">{appointment.patientName}</div>
                      <div className="text-xs text-muted-foreground">{appointment.patientContact}</div>
                   </TableCell>
                  <TableCell>{getDoctorName(appointment.doctorId)}</TableCell>
                  <TableCell>
                      <div>{format(new Date(appointment.date), "dd-MMM-yyyy")}</div>
                      <div className="text-xs text-muted-foreground">{appointment.time} ({appointment.duration} min)</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(appointment.status)}>{appointment.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <ModeIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.mode}</span>
                    </div>
                  </TableCell>
                  <TableCell>Rs. {appointment.fees.toLocaleString("en-IN")}</TableCell>
                   <TableCell>
                     <Badge variant={getPaymentStatusBadgeVariant(appointment.paymentStatus)}>{appointment.paymentStatus}</Badge>
                   </TableCell>
                  <TableCell>
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
                        <DropdownMenuItem onSelect={() => handleEdit(appointment)}>
                          <FileEdit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handlePrintSlip(appointment)}>
                           <Printer className="mr-2 h-4 w-4" />
                           Print Slip
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Medical History</DropdownMenuItem>
                        <DropdownMenuItem>Reschedule</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
          setIsDialogOpen(isOpen);
          if (!isOpen) {
              setEditingAppointment(null);
          }
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingAppointment ? "Edit Appointment" : "Schedule New Appointment"}</DialogTitle>
            <DialogDescription>
              {editingAppointment ? "Update the appointment details below." : "Fill in the details to register a new patient and schedule an appointment."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1"
            >
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="patientName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Patient Name</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="patientAge"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="Enter age" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="patientGender"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {genders.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="patientContact"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter contact number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {doctors.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name} - {d.department}
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
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 02:30 PM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="fees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultation Fee</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="In-person">In-person</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
                        <SelectItem value="Telephonic">Telephonic</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                         <SelectItem value="Paid">Paid</SelectItem>
                         <SelectItem value="Pending">Pending</SelectItem>
                         <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
             </div>
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Appointment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Annual checkup, follow-up, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                 <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingAppointment ? "Save Changes" : "Schedule Appointment"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {selectedAppointmentForSlip && (
          <AppointmentSlipDialog 
            appointment={selectedAppointmentForSlip}
            doctor={doctors.find(d => d.id === selectedAppointmentForSlip.doctorId)!}
            isOpen={isSlipOpen}
            onOpenChange={setIsSlipOpen}
          />
      )}
    </>
  );
}

    

    